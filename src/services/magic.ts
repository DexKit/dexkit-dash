import { OAuthExtension } from "@magic-ext/oauth";
import { Magic } from "magic-sdk";


 export const magic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
    extensions: [new OAuthExtension()],
  });