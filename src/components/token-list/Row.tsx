import React from "react";
import Link from "next/link";
import { ListChildComponentProps } from "react-window";
import { TToken } from "~/lib/api";
import { FaStar } from "react-icons/fa"

interface TokenRowProps extends ListChildComponentProps {
    data: TToken;
    isFavorite: boolean;
}

const TokenRow: React.FC<TokenRowProps> = ({ style, data, isFavorite }) => {
    if (!data) return null;

    return (
        <Link href={`/token/${data.chainId}/${data.address}`}>
            <div style={style} key={data.address} className={`border-b p-3 ${isFavorite ? 'bg-pink-100' : ''}`}>
                <div className="cursor-pointer float-left">
                    <img
                        src={data.logoURI || "/default-logo.png"}
                        alt={data.name}
                        width="30"
                        height="30"
                    />
                    {data.name}
                </div>
                <div className={`cursor-pointer float-right ml-2 ${isFavorite ? '' : 'hidden'}`}>
                    <FaStar className="text-yellow-500" />
                </div>

            </div>
        </Link>
    );
};

export default TokenRow;
