import { Poppins, Roboto_Condensed, Raleway, Numans, Montserrat , DM_Sans} from "next/font/google";

export const dm_sans = DM_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900" , "1000"],
  subsets: ["latin"],
  variable: "--font-dm_sans",
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const roboto_condensed = Roboto_Condensed({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-roboto_condensed",
});

export const raleway = Raleway({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const numans = Numans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-numans",
});

export const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700" , "800" , "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});
