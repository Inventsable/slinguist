export type Decorator = {
  title?: string;
  desc: string;
};
export type TranslateNode = {
  lang: string;
  index: number;
  title: string;
  desc: string;
};

export type LocalizationMapItem = {
  path: string;
  name: string;
  children?: LocalizationMapItem[];
};
