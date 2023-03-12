import { Wallet, Chain, Network, MetadataField } from "mintbase";
import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/router";
import { env } from "~/env.mjs";

const Mint = () => {
  const envVar = {
    mintBaseApi: process.env.NEXT_PUBLIC_MINTBASE_API,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  };

  const router = useRouter();
  const [nftTitle, setNftTitle] = useState<string>();
  const [nftDescription, setNftDescription] = useState<string>();
  const [nftImage, setNftImage] = useState<any>();
  const [nftAmount, setNftAmount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(nftImage);
  const onClickMint = async (e: any) => {
    setIsLoading(true);

    const formData = {
      title: nftTitle,
      description: nftDescription,
      image: nftImage,
      amount: Number(nftAmount),
    };

    e.preventDefault();
    const { data, error } = await new Wallet().init({
      networkName: Network.testnet,
      chain: Chain.near,
      apiKey: env.NEXT_PUBLIC_MINTBASE_API,
    });
    const { wallet } = data;

    if (error) {
      console.error("ERROR : ", error);
    }

    wallet?.minter?.setMetadata({
      title: formData.title,
      description: formData.description,
    });

    await wallet.mint(
      formData.amount,
      env.NEXT_PUBLIC_CONTRACT_ID,
      undefined,
      undefined,
      undefined
    );
    setIsLoading(false);
  };

  return (
    <>
      <section className="page-header-section style-1">
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-inner">
              <div className="page-title">
                <h2>Mint Page</h2>
              </div>
              <ol className="breadcrumb">
                <li>
                  <a href="index.html">Mint</a>
                </li>
                <li className="active">NFT</li>
              </ol>
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
                  <p>
                    Accepted Formats: image/png, image/jpeg, image/gif,
                    image/svg+xml | Ideal dimension: 1:1 | Max size: 5mb
                  </p>
                  <div className="custom-upload">
                    <div className="file-btn">
                      <i className="icofont-upload-alt"></i>
                      Upload a Image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setNftImage(e.currentTarget!.files![0]);
                      }}
                    />
                  </div>
                </div>
                <div className="form-floating item-name-field mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="itemNameInput"
                    placeholder="Item Name"
                    onChange={(e) => {
                      setNftTitle(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="itemNameInput">NFT Name</label>
                </div>
                <div className="form-floating item-desc-field mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Item Description"
                    id="itemDesc"
                    onChange={(e) => {
                      setNftDescription(e.currentTarget.value);
                    }}
                  ></textarea>
                  <label htmlFor="itemDesc">NFT Description</label>
                </div>
                <div className="form-floating item-name-field mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="itemNameInput"
                    placeholder="Item Name"
                    onChange={(e) => {
                      setNftTitle(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="itemNameInput">Royalities</label>
                </div>
                <div className="form-floating item-name-field mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="itemNameInput"
                    placeholder="Item Name"
                    onChange={(e) => {
                      setNftAmount(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="itemNameInput">Number of Copies</label>
                </div>
                {/* <div className="item-price-field mb-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="selectCrypto"
                          aria-label="Floating label select"
                        >
                          <option selected>Ethereum</option>
                          <option value="1">BitCoin</option>
                          <option value="2">Dollar</option>
                          <option value="3">Pound</option>
                        </select>
                        <label for="selectCrypto">Select Currency</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="itemPriceInput"
                          placeholder="Item Price"
                        />
                        <label for="itemPriceInput">Item Price</label>
                      </div>
                    </div>
                  </div>
                </div> */}

                {isLoading ? (
                  <div className="submit-btn-field text-center">
                    <button>Minting...</button>
                  </div>
                ) : (
                  <div className="submit-btn-field text-center">
                    <button type="submit" onClick={(e) => onClickMint(e)}>
                      Mint NFT
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="main">
      <section className="page-header-section style-1">
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-inner">
              <div className="page-title">
                <h2>Mint Page</h2>
              </div>
              <ol className="breadcrumb">
                <li>
                  <a href="index.html">Mint</a>
                </li>
                <li className="active">NFT</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-collection ma--bottom-lg">
        <form>
          <div className="">
            <label htmlFor="form-title">Name </label>
            <input
              type="text"
              name="title"
              id="form-title"
              onChange={(e) => {
                setNftTitle(e.currentTarget.value);
              }}
              className="input input__text"
              placeholder="Halloween Nights NFT"
            />
          </div>
          <div className="">
            <label htmlFor="form-title">Description </label>
            <textarea
              name="description"
              id="form-description"
              rows="8"
              onChange={(e) => {
                setNftDescription(e.currentTarget.value);
              }}
              placeholder="This a NFT that containes 25+ Halloween Nights collections."
            ></textarea>
          </div>
          <div className="">
            <label htmlFor="form-title"> Image </label>
            <input
              type="file"
              accept="image/*"
              name="title"
              onChange={(e) => {
                setNftImage(e.currentTarget.files[0]);
              }}
              id="form-nftImage"
            />
          </div>

          <div className="">
            <label htmlFor="form-nft-amount"> Amount to mint </label>
            <input
              type="number"
              name="amount"
              id="form-nft-amount"
              onChange={(e) => {
                setNftAmount(e.currentTarget.value);
              }}
            />
          </div>
          {isLoading ? (
            <button className="default-btn move-right" id="btn-mint-nft">
              <span>Loading...</span>
            </button>
          ) : (
            <button
              className="default-btn move-right"
              id="btn-mint-nft"
              onClick={(e) => onClickMint(e)}
            >
              <span>Mint NFT</span>
            </button>
          )}
        </form>
      </section>
    </div> */}
    </>
  );
};

export default Mint;
