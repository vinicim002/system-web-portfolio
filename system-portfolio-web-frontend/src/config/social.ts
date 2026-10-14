import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";
import { siteConfig } from "./site";

export type SocialKey = keyof typeof siteConfig.social;

export const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
} as const;

// Apenas as redes que já têm link configurado
export function getActiveSocials() {
  return (Object.keys(siteConfig.social) as SocialKey[])
    .filter((key) => siteConfig.social[key])
    .map((key) => ({ key, href: siteConfig.social[key] as string, Icon: socialIcons[key] }));
}
