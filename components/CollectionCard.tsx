import Link from "next/link";
import Image from "next/image";
import { collection } from "@prisma/client";

export const CollectionCard = ({ post }: { post: collection }) => {
  //   post.price?.toLocaleString("fullwide", { useGrouping: false }) * 10 ** -24;
  return (
    <Link
      href={`/collection/${post.metadataId}`}
      className="col-xl-4 col-lg-4 col-sm-6"
    >
      <div className="nft-item home-4">
        <div className="nft-inner">
          {/* <!-- nft top part --> */}
          <div className="nft-item-top d-flex justify-content-between align-items-center">
            <div className="author-part">
              <ul className="author-list d-flex">
                <li className="single-author d-flex align-items-center">
                  <span className="veryfied">
                    <Image
                      loading="lazy"
                      src="/assets/images/seller/author.jpg"
                      alt="author-img"
                      width={100}
                      height={100}
                    />
                  </span>
                  <h6>
                    <span>Allie eve knox </span>
                  </h6>
                </li>
              </ul>
            </div>
          </div>
          {/* <!-- nft-bottom part --> */}
          <div className="nft-item-bottom">
            <div
              className="nft-thumb"
              style={{ width: "100%", height: "260px" }}
            >
              <Image loading="lazy" src={post.nftImage} alt="nft-img" fill />
            </div>
            <div className="nft-content">
              <h4>{post.name}</h4>
              <div className="price-like d-flex justify-content-between align-items-center">
                <p className="nft-price">
                  Price:{" "}
                  <span className="yellow-color">
                    {Math.round(post.price!)} NEAR
                  </span>
                </p>
                {/* <a href="#" className="nft-like">
                  <i className="icofont-heart"></i> 230
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
