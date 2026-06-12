import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Collections from "./pages/Collections";
import Delivery from "./pages/Delivery";
import Contacts from "./pages/Contacts";
import SizeGuide from "./pages/SizeGuide";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Search from "./pages/Search";
import Care from "./pages/Care";

const BOTANICAL_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
<defs>
  <style>.b{fill:none;stroke:white;stroke-linecap:round;stroke-linejoin:round}</style>
</defs>
<g class='b' stroke-width='0.8' opacity='1'>

<!-- Central lotus bloom at 300,300 -->
<circle cx='300' cy='300' r='6'/>
<circle cx='300' cy='300' r='3'/>
<!-- 8 petals -->
<path d='M300 294 C296 282 292 272 300 262 C308 272 304 282 300 294Z'/>
<path d='M306 296 C317 290 326 284 334 290 C328 300 318 300 306 296Z'/>
<path d='M306 304 C317 310 326 316 322 326 C312 322 306 314 306 304Z'/>
<path d='M300 306 C296 318 292 328 300 338 C308 328 304 318 300 306Z'/>
<path d='M294 304 C283 310 274 316 278 326 C288 322 294 314 294 304Z'/>
<path d='M294 296 C283 290 274 284 266 290 C272 300 282 300 294 296Z'/>
<!-- Outer ring petals -->
<path d='M300 286 C294 268 286 252 300 238 C314 252 306 268 300 286Z'/>
<path d='M314 293 C330 284 346 272 358 282 C348 296 332 298 314 293Z'/>
<path d='M314 307 C330 316 346 328 342 342 C328 338 316 326 314 307Z'/>
<path d='M300 314 C294 332 286 348 300 362 C314 348 306 332 300 314Z'/>
<path d='M286 307 C270 316 254 328 258 342 C272 338 284 326 286 307Z'/>
<path d='M286 293 C270 284 254 272 242 282 C252 296 268 298 286 293Z'/>

<!-- Curved main stem from bottom-left -->
<path d='M20 580 C60 520 110 460 160 400 C210 340 270 285 300 300'/>
<!-- Branch left from main stem -->
<path d='M120 480 C90 460 60 455 35 462'/>
<path d='M160 430 C130 408 100 402 72 408'/>
<path d='M200 385 C172 362 144 355 118 360'/>
<!-- Leaves on left branch -->
<path d='M35 462 C28 452 30 440 40 438 C46 448 42 458 35 462Z'/>
<path d='M72 408 C65 398 67 386 77 384 C83 394 79 404 72 408Z'/>
<path d='M118 360 C111 350 113 338 123 336 C129 346 125 356 118 360Z'/>

<!-- Branch right from main stem -->
<path d='M240 340 C265 318 285 295 300 300'/>
<path d='M265 318 C272 296 280 278 292 268'/>
<!-- Small flower bud on right branch -->
<path d='M292 268 C288 258 284 250 292 244 C300 250 296 258 292 268Z'/>
<path d='M292 268 C298 260 306 254 310 262 C306 270 298 270 292 268Z'/>

<!-- Curved main stem from top-right -->
<path d='M580 20 C540 80 490 140 440 200 C390 260 340 280 300 300'/>
<!-- Branch right from top stem -->
<path d='M480 140 C510 120 530 100 545 80'/>
<path d='M440 180 C470 162 492 144 508 124'/>
<!-- Leaves on top-right branches -->
<path d='M545 80 C552 70 562 68 566 76 C560 84 550 84 545 80Z'/>
<path d='M508 124 C515 114 525 112 529 120 C523 128 513 128 508 124Z'/>

<!-- Pomegranate fruit at top-left area -->
<path d='M80 120 C72 108 70 94 80 86 C90 94 88 108 80 120Z'/>
<path d='M80 86 C74 80 74 72 80 68 C86 72 86 80 80 86Z'/>
<path d='M68 100 C60 96 56 88 62 84 C68 88 70 96 68 100Z'/>
<path d='M92 100 C100 96 104 88 98 84 C92 88 90 96 92 100Z'/>
<circle cx='80' cy='104' r='3'/>
<circle cx='74' cy='96' r='2'/>
<circle cx='86' cy='96' r='2'/>
<circle cx='80' cy='90' r='2'/>
<!-- Stem to pomegranate -->
<path d='M20 580 C40 500 55 420 68 340 C76 290 80 240 80 120'/>

<!-- Pomegranate fruit at bottom-right -->
<path d='M520 480 C512 468 510 454 520 446 C530 454 528 468 520 480Z'/>
<path d='M520 446 C514 440 514 432 520 428 C526 432 526 440 520 446Z'/>
<path d='M508 460 C500 456 496 448 502 444 C508 448 510 456 508 460Z'/>
<path d='M532 460 C540 456 544 448 538 444 C532 448 530 456 532 460Z'/>
<circle cx='520' cy='464' r='3'/>
<circle cx='514' cy='456' r='2'/>
<circle cx='526' cy='456' r='2'/>
<!-- Stem to bottom-right pomegranate -->
<path d='M580 20 C560 100 545 180 532 260 C524 310 520 360 520 480'/>

<!-- Delicate scrollwork tendrils -->
<path d='M140 320 C148 308 152 294 144 284 C136 294 136 308 140 320Z'/>
<path d='M140 284 C136 274 130 268 124 272 C126 280 132 284 140 284Z'/>
<path d='M380 420 C388 408 392 394 384 384 C376 394 376 408 380 420Z'/>
<path d='M380 384 C376 374 370 368 364 372 C366 380 372 384 380 384Z'/>

<!-- Small 5-petal flowers scattered -->
<!-- Flower at 150,200 -->
<circle cx='150' cy='200' r='3'/>
<path d='M150 193 C147 186 143 181 150 178 C157 181 153 186 150 193Z'/>
<path d='M157 197 C164 194 169 190 170 197 C165 202 158 201 157 197Z'/>
<path d='M155 205 C160 212 160 218 154 218 C150 212 150 206 155 205Z'/>
<path d='M145 205 C140 212 140 218 146 218 C150 212 150 206 145 205Z'/>
<path d='M143 197 C136 194 131 190 130 197 C135 202 142 201 143 197Z'/>

<!-- Flower at 450,380 -->
<circle cx='450' cy='380' r='3'/>
<path d='M450 373 C447 366 443 361 450 358 C457 361 453 366 450 373Z'/>
<path d='M457 377 C464 374 469 370 470 377 C465 382 458 381 457 377Z'/>
<path d='M455 385 C460 392 460 398 454 398 C450 392 450 386 455 385Z'/>
<path d='M445 385 C440 392 440 398 446 398 C450 392 450 386 445 385Z'/>
<path d='M443 377 C436 374 431 370 430 377 C435 382 442 381 443 377Z'/>

<!-- Flower at 480,80 -->
<circle cx='480' cy='80' r='2.5'/>
<path d='M480 74 C477 68 474 63 480 61 C486 63 483 68 480 74Z'/>
<path d='M486 78 C492 75 496 72 497 78 C493 82 487 81 486 78Z'/>
<path d='M484 84 C488 90 488 95 483 95 C480 90 480 85 484 84Z'/>
<path d='M476 84 C472 90 472 95 477 95 C480 90 480 85 476 84Z'/>
<path d='M474 78 C468 75 464 72 463 78 C467 82 473 81 474 78Z'/>

<!-- Flower at 120,460 -->
<circle cx='120' cy='460' r='2.5'/>
<path d='M120 454 C117 448 114 443 120 441 C126 443 123 448 120 454Z'/>
<path d='M126 458 C132 455 136 452 137 458 C133 462 127 461 126 458Z'/>
<path d='M124 464 C128 470 128 475 123 475 C120 470 120 465 124 464Z'/>
<path d='M116 464 C112 470 112 475 117 475 C120 470 120 465 116 464Z'/>
<path d='M114 458 C108 455 104 452 103 458 C107 462 113 461 114 458Z'/>

<!-- Paisley motif at 400,150 -->
<path d='M400 150 C390 130 388 108 400 96 C412 108 410 130 400 150Z'/>
<path d='M400 150 C414 140 424 126 418 114 C408 118 402 132 400 150Z'/>
<path d='M400 96 C396 88 390 84 386 88 C388 96 394 98 400 96Z'/>
<path d='M418 114 C424 108 426 100 420 98 C416 104 416 110 418 114Z'/>
<!-- Inner detail -->
<path d='M400 140 C396 128 394 116 400 108 C406 116 404 128 400 140Z'/>

<!-- Paisley motif at 200,480 -->
<path d='M200 480 C190 460 188 438 200 426 C212 438 210 460 200 480Z'/>
<path d='M200 480 C214 470 224 456 218 444 C208 448 202 462 200 480Z'/>
<path d='M200 426 C196 418 190 414 186 418 C188 426 194 428 200 426Z'/>
<!-- Inner detail -->
<path d='M200 470 C196 458 194 446 200 438 C206 446 204 458 200 470Z'/>

<!-- Fine vine connecting elements -->
<path d='M80 120 C100 160 120 200 140 240 C160 280 180 310 200 340'/>
<path d='M200 340 C220 360 240 370 260 372'/>
<path d='M520 480 C500 440 480 400 460 360 C440 320 420 290 400 270'/>
<path d='M400 270 C380 252 360 242 340 240'/>

<!-- Tiny leaf pairs along vine -->
<path d='M110 142 C104 134 106 124 114 124 C116 132 114 140 110 142Z'/>
<path d='M110 142 C116 134 118 124 110 124 C108 132 108 140 110 142Z'/>
<path d='M130 182 C124 174 126 164 134 164 C136 172 134 180 130 182Z'/>
<path d='M130 182 C136 174 138 164 130 164 C128 172 128 180 130 182Z'/>
<path d='M150 222 C144 214 146 204 154 204 C156 212 154 220 150 222Z'/>
<path d='M150 222 C156 214 158 204 150 204 C148 212 148 220 150 222Z'/>
<path d='M175 262 C169 254 171 244 179 244 C181 252 179 260 175 262Z'/>
<path d='M175 262 C181 254 183 244 175 244 C173 252 173 260 175 262Z'/>

<path d='M510 458 C504 450 506 440 514 440 C516 448 514 456 510 458Z'/>
<path d='M510 458 C516 450 518 440 510 440 C508 448 508 456 510 458Z'/>
<path d='M490 418 C484 410 486 400 494 400 C496 408 494 416 490 418Z'/>
<path d='M490 418 C496 410 498 400 490 400 C488 408 488 416 490 418Z'/>
<path d='M470 378 C464 370 466 360 474 360 C476 368 474 376 470 378Z'/>
<path d='M470 378 C476 370 478 360 470 360 C468 368 468 376 470 378Z'/>

<!-- Corner decorative element top-right -->
<path d='M560 40 C548 52 540 66 538 80 C550 78 560 68 560 40Z'/>
<path d='M560 40 C572 52 578 66 576 80 C564 78 560 68 560 40Z'/>
<circle cx='560' cy='40' r='4'/>
<path d='M540 60 C530 56 524 48 528 42 C536 44 540 52 540 60Z'/>
<path d='M580 60 C590 56 596 48 592 42 C584 44 580 52 580 60Z'/>

<!-- Corner decorative element bottom-left -->
<path d='M40 560 C52 548 66 540 80 538 C78 550 68 560 40 560Z'/>
<path d='M40 560 C52 572 66 578 80 576 C78 564 68 560 40 560Z'/>
<circle cx='40' cy='560' r='4'/>

</g>
</svg>`;

const botanicalDataUrl = `data:image/svg+xml,${encodeURIComponent(BOTANICAL_SVG)}`;

function BotanicalOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundImage: `url("${botanicalDataUrl}")`,
        backgroundSize: '700px 700px',
        backgroundRepeat: 'repeat',
        opacity: 0.13,
      }}
    />
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <CartSidebar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/catalog" component={() => <Layout><Catalog /></Layout>} />
      <Route path="/product/:id" component={() => <Layout><ProductDetail /></Layout>} />
      <Route path="/checkout" component={() => <Layout><Checkout /></Layout>} />
      <Route path="/about" component={() => <Layout><About /></Layout>} />
      <Route path="/collections" component={() => <Layout><Collections /></Layout>} />
      <Route path="/collections/:id" component={() => <Layout><Collections /></Layout>} />
      <Route path="/delivery" component={() => <Layout><Delivery /></Layout>} />
      <Route path="/contacts" component={() => <Layout><Contacts /></Layout>} />
      <Route path="/size-guide" component={() => <Layout><SizeGuide /></Layout>} />
      <Route path="/returns" component={() => <Layout><Returns /></Layout>} />
      <Route path="/privacy" component={() => <Layout><Privacy /></Layout>} />
      <Route path="/search" component={() => <Layout><Search /></Layout>} />
      <Route path="/care" component={() => <Layout><Care /></Layout>} />
      <Route path="/terms" component={() => <Layout><Privacy /></Layout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <BotanicalOverlay />
            <Toaster position="bottom-right" />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
