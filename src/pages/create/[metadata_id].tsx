import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { Wallet, Chain, Network, MetadataField } from "mintbase";
import axios from "axios";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { utils } from "near-api-js";
import { useWallet } from "@mintbase-js/react/lib/WalletContext";
import { supabase } from "~/utils/supabase";

const UploadFiles = () => {
  const addCollection = api.collection.addCollections.useMutation();
  const [nftData, setNftData] = useState<any>();
  const [collectionImages, setCollectionImages] = useState<any>();
  const [isUploading, setIsUploading] = useState(false);
  const { activeAccountId } = useWallet();
  const router = useRouter();
  const metadata_id: any = router.query.metadata_id;

  useEffect(() => {
    if (activeAccountId != env.NEXT_PUBLIC_OWNER) {
      router.push("/");
    }
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

    const operations = (metadata_id: string | string[] | undefined) => {
      return `
      query MyQuery {
        mb_views_active_listings(
          where: {metadata_id: {_eq: "${metadata_id}"}}
          distinct_on: metadata_id
        ) {
          description
          media
          metadata_id
          price
          title
        }
      }    
    `;
    };

    async function fetchCheckNFT() {
      const { errors, data } = await fetchGraphQL(
        operations(metadata_id),
        "MyQuery",
        {}
      );
      setNftData(data.mb_views_active_listings[0]);
    }
    fetchCheckNFT();
  });

  const uploadFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }

    Array.from(e.target?.files!).forEach(async (file) => {
      const { data, error } = await supabase.storage
        .from("collectionimages")
        .upload(`${nftData.title}/${file?.name}`, file as File);
      console.log(data);
    });
    // const { data, error } = await supabase.storage
    //   .from("collectionimages")
    //   .list(`${nftData.title}`, {
    //     limit: 100,
    //     offset: 0,
    //   });
    // console.log(data);

    // const { data, error } = await supabase.storage
    //   .from("collectionimages")
    //   .upload(`${nftData.title}/${file?.name}`, file as File);

    // if (data) console.log(data);
    // if (error) console.log(error);
  };

  const onClickFilesBtn = async (e: any) => {
    e.preventDefault();

    setIsUploading(true);

    const { data, error } = await new Wallet().init({
      networkName: Network.testnet,
      chain: Chain.near,
      apiKey: env.NEXT_PUBLIC_MINTBASE_API,
    });

    const { wallet } = data;

    const signerRes = await wallet.signMessage("test-message");

    // var formdata = new FormData();

    // formdata.append("name", nftData.title);
    // formdata.append("description", nftData.description);
    // formdata.append("price", nftData.price);
    // formdata.append("metadata_id", metadata_id);
    // formdata.append("nftImage", nftData.media);
    // formdata.append("signerRes", JSON.stringify(signerRes));

    // Object.values(collectionImages).forEach((el: any) => {
    //   formdata.append("files", el, el.name);
    // });

    // axios
    //   .post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/addCollection`,
    //     formdata,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   )
    // .then((response) => {
    //   window.location.href = `/collection/${metadata_id}`;
    //   setIsUploading(false);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    const priceYocto = nftData?.price.toLocaleString().replace(/,/g, "");
    const priceNear = utils.format.formatNearAmount(priceYocto, 2);

    // if (activeAccountId == env.NEXT_PUBLIC_OWNER) {

    let url: string[] = [];
    const { data: imageList, error: imageError } = await supabase.storage
      .from("collectionimages")
      .list(`${nftData.title}`, {
        limit: 100,
        offset: 0,
      });
    imageList?.forEach(async (image) => {
      let { data } = await supabase.storage
        .from("collectionimages")
        .getPublicUrl(`${nftData.title}/${image.name}`);
      url.push(data.publicUrl);
    });
    addCollection
      .mutateAsync({
        name: nftData.title,
        description: nftData.description,
        price: parseInt(priceNear),
        metadataId: metadata_id,
        nftImage: nftData.media,
        connectedAccount: activeAccountId!,
        files: url,
      })
      .then(() => {
        console.log("done");
      });
    // }
  };
  // console.log(addCollection.data);

  const ele = nftData ? (
    <>
      <section
        className="profile-section padding-top padding-bottom"
        style={{ backgroundColor: "#1a203c" }}
      >
        <div className="container">
          <div className="section-wrapper">
            <div className="member-profile">
              <div className="profile-item">
                <div className="profile-cover">
                  <img
                    src="../assets/images/profile/cover.jpg"
                    alt="cover-pic"
                  />
                </div>
                <div className="profile-information">
                  <div className="profile-pic">
                    <img src={nftData.media} alt="DP" />
                  </div>
                  <div className="profile-name">
                    <h4 style={{ textAlign: "left" }}>{nftData.title}</h4>
                    <p>{nftData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="tab-pane fade mentions-section show active"
        id="pills-personal"
        role="tabpanel"
        aria-labelledby="pills-personal-tab"
      >
        <div className="row">
          <div className="col">
            <div className="create-nft d-flex justify-content-center py-5 px-4">
              <form className="create-nft-form col-8">
                <div className="upload-item mb-30">
                  {collectionImages ? (
                    <p>Images Added, Ready to Create Collection...</p>
                  ) : (
                    <p>PNG,JPG,JPEG,SVG,WEBP</p>
                  )}

                  <div className="custom-upload">
                    {collectionImages ? (
                      <div className="file-btn">
                        <i className="icofont-check"></i>
                        Added
                      </div>
                    ) : (
                      <div className="file-btn">
                        <i className="icofont-upload-alt"></i>
                        Upload a Images
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      name="title"
                      onChange={(e) => {
                        uploadFiles(e);
                      }}
                      multiple
                      id="form-nftImage"
                    />
                  </div>
                </div>
                <div className="submit-btn-field text-center">
                  {isUploading ? (
                    <button type="submit">Uploading...</button>
                  ) : (
                    <button
                      type="submit"
                      id="btn-upload-file"
                      onClick={(e) => onClickFilesBtn(e)}
                    >
                      Create Collection
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <section className="page-header-section style-1 vh-100">
      <div className="container">
        <div className="page-header-content">
          <div className="page-header-inner">
            <div className="page-title">
              <h2>Loading... </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  if (addCollection.isError) return alert("error");
  return ele;
};

export default UploadFiles;
