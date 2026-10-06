import React from "react";
import { renderToString } from "react-dom/server";
import { dehydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { Router } from "wouter";
import App from "./App";
import { api } from "@shared/api";
import type { GetProductsRequest } from "../shared/api/products/types";
import { productKeys } from "./entities/products/queryKeys";
import { categoryKeys } from "./entities/categories/queryKeys";
import { collectionKeys } from "./entities/collections/queryKeys";

const publicSiteUrl = (process.env.PUBLIC_SITE_URL || "https://iamsuvarna.ru").replace(/\/$/, "");
api.defaults.baseURL = `${publicSiteUrl}/api`;
const serverApi = axios.create({ baseURL: process.env.INTERNAL_API_URL || "http://backend:4000/api" });
const getCategories = async () => (await serverApi.get("/categories")).data;
const getCollections = async () => (await serverApi.get("/collections")).data;
const getCollectionBySlug = async (slug: string) => (await serverApi.get(`/collections/${encodeURIComponent(slug)}`)).data;
const getProductById = async (id: number) => (await serverApi.get(`/products/${id}`)).data;
const getProducts = async (params: GetProductsRequest = {}) => (await serverApi.get("/products", { params })).data;
const getHeroSlides = async () => (await serverApi.get("/hero-slides")).data;

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
  });
  const parsed = new URL(url, "https://iamsuvarna.ru");
  const path = parsed.pathname;
  let missingResource = false;

  const safePrefetch = async (key: readonly unknown[], query: () => Promise<unknown>, checkNotFound = false) => {
    try {
      await queryClient.prefetchQuery({ queryKey: key, queryFn: query });
    } catch (error) {
      if (checkNotFound && (error as { response?: { status?: number } })?.response?.status === 404) missingResource = true;
      console.error("SSR data preload failed:", path, error instanceof Error ? error.message : error);
    }
  };

  await Promise.all([
    safePrefetch(categoryKeys.all, getCategories),
    safePrefetch(collectionKeys.all, getCollections),
  ]);

  if (path === "/") {
    await Promise.all([
      safePrefetch(productKeys.list({}), () => getProducts()),
      safePrefetch(["hero-slides"], getHeroSlides),
    ]);
  } else if (path === "/catalog") {
    const category = parsed.searchParams.get("category");
    const collection = parsed.searchParams.get("collection");
    const params = {
      ...(category && category !== "all" ? { category } : {}),
      ...(collection ? { collection } : {}),
    };
    await safePrefetch(productKeys.list(params), () => getProducts(params));
  } else if (path.startsWith("/product/")) {
    const id = Number(path.split("/")[2]);
    if (Number.isSafeInteger(id) && id > 0) {
      await safePrefetch(productKeys.detail(id), () => getProductById(id), true);
      const product = queryClient.getQueryData<{ categories: Array<{ slug: string }> }>(productKeys.detail(id));
      const category = product?.categories[0]?.slug;
      if (category) {
        await safePrefetch(productKeys.list({ category }), () => getProducts({ category }));
      }
    }
  } else if (path.startsWith("/collections/")) {
    const slug = path.split("/")[2];
    if (slug) {
      await safePrefetch(collectionKeys.detail(slug), () => getCollectionBySlug(slug), true);
    }
  } else if (path === "/search") {
    await safePrefetch(productKeys.list({}), () => getProducts());
  }

  const staticLocation: any = () => [path, () => undefined];
  staticLocation.searchHook = () => parsed.search.slice(1);
  const appHtml = renderToString(
    <Router hook={staticLocation}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  );

  return {
    appHtml,
    queryState: dehydrate(queryClient),
    queryClient,
    path,
    missingResource,
  };
}
