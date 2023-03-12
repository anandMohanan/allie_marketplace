import { collection } from "@prisma/client";
import axios from "axios";
import { CollectionCard } from "components/CollectionCard";
import { MainSection } from "components/MainSection";
import { WalletSection } from "components/WalletSection";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, Key } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [content, setContent] = useState<any>();
  const getCollection = api.collection.getHomeCollections.useQuery();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection`
  //     );

  //     setContent(res.data);
  //   };
  //   fetchData();
  // }, []);
  if (getCollection.isError) return <h1>{getCollection.error.message}</h1>;
  console.log(getCollection.data);

  return (
    <>
      <MainSection collection={content?.collection[0]} />
      <WalletSection />

      <section className="ex-drop-section padding-bottom">
        <div className="container">
          <div className="section-header style-4">
            <div className="header-shape">
              <span></span>
            </div>
            <h3>NSFW Collections</h3>
          </div>
          <div className="section-wrapper">
            <div className="ex-drop-wrapper">
              <div className="row gx-4 gy-3 d-flex justify-content-start">
                {getCollection.data ? (
                  getCollection.data.length !== 0 ? (
                    getCollection.data.map((post: collection, id: number) => {
                      return <CollectionCard post={post} key={id} />;
                    })
                  ) : (
                    <h3>Sorry!... There is No Collection Now.</h3>
                  )
                ) : (
                  <h1>Loading..</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /* <HowItWorks /> */}
    </>
  );
};

export default Home;
