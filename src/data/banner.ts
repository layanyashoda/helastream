import desktop1 from "@/assets/banner/desktop1.webp";
import desktop2 from "@/assets/banner/desktop2.webp";
import mobile1 from "@/assets/banner/mobile1.webp";
import mobile2 from "@/assets/banner/mobile2.webp";
import nameOne from "@/assets/banner/nameOne.avif";
import nameTwo from "@/assets/banner/nameTwo.avif";
import mandaraBanner from "@/assets/banner/mandara_banner.jpg";
import mandaraTitle from "@/assets/banner/mandara_title.png";
import modaTharinduBanner from "@/assets/banner/modatharindu_banner.jpg";
import modaTharinduTitle from "@/assets/banner/modatharindu_title.png";
import gajamanBanner from "@/assets/banner/gajaman_banner.jpg";
import gajamanTitle from "@/assets/banner/gajaman_title.png";

// Fallback images for other indices
import wide1 from "@/assets/banner/1.jpg";
import wide2 from "@/assets/banner/2.jpg";
import wide3 from "@/assets/banner/3.jpg";

const bannerImages = [
    {
        imageName: nameOne,
        mobileImage: mobile1,
        desktopImage: desktop1,
    },
    {
        imageName: nameTwo,
        mobileImage: mobile2,
        desktopImage: desktop2,
    },
    {
        // Index 2: Moda Tharindu
        imageName: modaTharinduTitle,
        mobileImage: modaTharinduBanner,
        desktopImage: modaTharinduBanner,
    },
    {
        // Index 3: Gajaman
        imageName: gajamanTitle,
        mobileImage: gajamanBanner,
        desktopImage: gajamanBanner,
    },
    {
        // Index 4: Mandara
        imageName: mandaraTitle,
        mobileImage: mandaraBanner,
        desktopImage: mandaraBanner,
    },
    {
        // Index 5: One Piece
        imageName: nameTwo,
        mobileImage: mobile2,
        desktopImage: desktop2,
    },
];

export default bannerImages;
