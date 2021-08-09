import {GeneralConfig, SocialNetworks, Collection} from 'types/myApps';
import {HelpText} from '../shared';

export const HELP_TEXT_SOCIAL_NETWORK_LINKS: HelpText<SocialNetworks> = {
  facebook_url: ['Enter with a valid facebook URL'],
  reddit_url: ['Enter with a valid Reddit URL'],
  twitter_url: ['Enter with a valid twitter URL'],
  telegram_url: ['Enter with a valid telegram URL'],
  discord_url: ['Enter with a valid discord URL'],
  bitcointalk_url: ['Enter with a valid bitcointalk URL'],
  youtube_url: ['Enter with a valid Youtube URL'],
  medium_url: ['Enter with a valid medium URL'],
};
export const HELP_TEXT: HelpText<GeneralConfig> = {
  title: [
    'Enter a name that has not yet been used in other projects as the title of the current project.',
  ],
  icon: ['Enter the url of your project logo'],
  domain: ['Enter your project url'],
  feePercentage: ['Enter the percentage from 0 to 0.5 that you want to charge'],
  feeRecipient: ['Enter the wallet that should receive the fee'],
};

export const HELP_TEXT_COLLECTIONS: HelpText<Collection> = {
  address: ['Enter the collection address'],
  name: ['Collection name'],
  imageUrl: ['Collection imagem url'],
  slug: ['Collection slug'],
  description: ['Collection description'],
  id: ['Collection id'],
  assetCount: [] as string[],
  hidden: [] as string[],
};

export const HELP_TEXT_ARTIST_COLLECTIONS: HelpText<{
  [key: string]: string[];
}> = {
  address: ["Enter an artist's address to filter the collections"],
};
