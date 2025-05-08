import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  ShirtIcon,
  ShoppingBasket,
  Umbrella,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Umbrella },
];

const brandsWithIcon = [
  {
    id: "nike",
    label: "Nike",
    imageSrcUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACUCAMAAABVwGAvAAAAZlBMVEX///8AAADr6+v19fX8/Pyfn5/y8vLZ2dn5+fnPz89+fn5ycnKsrKzu7u7j4+MtLS24uLiPj48jIyNMTExZWVnFxcVjY2M+Pj5eXl5SUlIaGhqEhIQyMjJra2s3NzdGRkYTExOXl5dN/S9KAAAC/klEQVR4nO3a63arKhQF4CxviBIVo8bE2Mb3f8lta29RjOAt44wzv9+Cs7qAgD0cAAAAAAAAAAAAAAAAAADgv8fxX3ZnnWvEcfMcClaUc53rKnfrJEORqKSwda50450fnsPk6VYzvYpqaM+HZ/OkJjpLT/P6hEj30uWSKrsTxYml3YBIbhnoh8XdG7XSghk0iom0hs8ykRu80ydpEO5gt40yrfEzm2/lQXrtsr25RnXkhLTtuz3mbk3fssRw9nc/Wpk8bSNHUZzvP+FKZvqW+Ge7LZI5LJc3+nWTkXEfx89qLdcPx2X9NxuRMA93OHRVIVZN5rEke0hG9zKf1VPSNV9xWjkmVUk9Adf5UTLE4q79OiPD8Zj7lvazxVJ7eej7GvDpnLLo8ZkI4n40oouYHe771VK8OB6vTops9J4vWMqtr3l82dOzuMgUydpeq2UlLX96ml17RxGclNmImoUFzX+7mvNn+hGvBuPgt+SWZWv9+bONl1yHu6Gq2Dq16cKqkP/p727S0LeSIr6PZkvDaN4s93iTh8kz0W0WJc1lNFnr3KwwSR0eKq910toIRW52fpaNbqvtRnuTQThxebuOhk+TtRVSz1tYVax+589Gh5/LcnSQfpu7sCpVg+4LddFYzH2fStYuD82qRyCe4papO1gemaieF1vnIlbehubK26R1Ytm+0/Jtj4li+PND4ZppbvUNNKN3i7OwqsJsfM7tXW60KdRkP527DAzrYQ2DcTtLqT2ZG2IrhKv5ZueVyfTdn7tVm7zVL+6ycG+zNoU7xTvn2x7ILIl3D9ZbWEeJuekkW3FhHTVv5F72OuCdM++V+W6H4/7gnGFCGm52xKZiNjbSpZtCU5Hukk8fs9z+34vkdKxOuNXC+pR9nU5GHwvrHhOJQjSd7yRf8hWwwyfCFfqfbTbBxg5v2h/op2a/j1hjbFe9lyjEDt+IdFiid1hyjYPc2voHiYlIyKAuyrIOKyn461+pgu95nv2yfyUAAAAAAAAAAAAAAAAAAPjf+wesLx8tA88gZAAAAABJRU5ErkJggg==",
  },
  {
    id: "adidas",
    label: "Adidas",
    imageSrcUrl:
      "data:image/jpeg;base64,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",
  },
  {
    id: "puma",
    label: "Puma",
    imageSrcUrl:
      "data:image/png;base64,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",
  },
  {
    id: "uspolo",
    label: "U.S.Polo",
    imageSrcUrl:
      "data:image/png;base64,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",
  },
  {
    id: "h&m",
    label: "H&M",
    imageSrcUrl:
      "data:image/png;base64,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",
  },
  {
    id: "zara",
    label: "ZARA",
    imageSrcUrl:
      "https://logomakerr.ai/blog/wp-content/uploads/2022/08/2019-to-Present-Zara-logo-design.jpg",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % featureImageList.length
      );
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.map((slide, index) => (
          <img
            src={slide?.image}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => {
              const Icon = brandItem.icon;
              return (
                <Card
                  key={brandItem.id}
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {brandItem.imageSrcUrl ? (
                      <img
                        src={brandItem.imageSrcUrl}
                        alt={brandItem.label}
                        className="w-16 h-16 object-contain mb-4"
                      />
                    ) : Icon ? (
                      <Icon className="w-12 h-12 mb-4 text-primary" />
                    ) : null}
                    <span className="font-bold">{brandItem.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.map((productItem) => (
              <ShoppingProductTile
                key={productItem.id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
