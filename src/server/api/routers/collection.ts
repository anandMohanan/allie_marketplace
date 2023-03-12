import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  getHomeCollections: publicProcedure.query(({ ctx }) => {
    const collections = ctx.prisma.collection.findMany({ take: 8 });
    return collections;
  }),
  addCollections: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        metadataId: z.string(),
        nftImage: z.string(),
        connectedAccount: z.string(),
        files: z.array(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      console.log(input.connectedAccount == env.NEXT_PUBLIC_OWNER);

      if (input.connectedAccount == env.NEXT_PUBLIC_OWNER) {
        const collection = ctx.prisma.collection.create({
          data: {
            name: input.name,
            description: input.description,
            metadataId: input.metadataId,
            price: input.price,
            nftImage: input.nftImage,
            Files: input.files,
          },
        });
        return collection;
      } else {
        throw new Error("Unauthenticated");
      }
    }),
  getCollectionById: publicProcedure
    .input(z.object({ metadataId: z.string(), accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      let collection;
      const walletAddress = input.accountId;
      const metadata_id = input.metadataId;

      const operations = (walletAddress_: string, metadata_id_: string) => {
        return `
        query checkNFT {
          mb_views_nft_tokens(
            distinct_on: metadata_id
            where: {owner: {_eq: "${walletAddress_}"}, _and: {burned_timestamp: {_is_null: true}, metadata_id: {_eq: "${metadata_id_}"}}}
          ) {
            owner
          }
        }
      `;
      };

      async function fetchGraphQL(
        operationsDoc: string,
        operationName: string,
        variables: {}
      ) {
        const result = await fetch(
          "https://interop-testnet.hasura.app/v1/graphql",
          {
            method: "POST",
            body: JSON.stringify({
              query: operationsDoc,
              variables: variables,
              operationName: operationName,
            }),
          }
        );

        return await result.json();
      }

      function fetchCheckNFT() {
        return fetchGraphQL(
          operations(walletAddress, metadata_id),
          "checkNFT",
          {}
        );
      }

      const { errors, data } = await fetchCheckNFT();

      let pass;
      console.log(data);

      if (data.mb_views_nft_tokens[0]) {
        const owner = data.mb_views_nft_tokens[0].owner;
        console.log(owner);
        console.log(walletAddress);

        if (owner == walletAddress) {
          pass = true;
        }
      } else {
        pass = false;
      }

      console.log("DATA : ", data.mb_views_nft_tokens[0]);

      if (errors && !pass) {
        console.log("error");
      }
      // if there is data that means the owner owns that NFT
      else {
        collection = ctx.prisma.collection.findFirst({
          where: {
            metadataId: input.metadataId,
          },
        });
        return collection;
      }
    }),
});
