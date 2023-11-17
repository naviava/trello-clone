import { Card, List } from "@prisma/client";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };
