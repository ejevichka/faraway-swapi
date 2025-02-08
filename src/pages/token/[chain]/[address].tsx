import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState, useEffect } from 'react';
import cache from '~/utils/cache';
import { TToken, fetchTokens } from '~/lib/api';

type TokenDetailPageProps = {
  token: {
    chain: number;
    address: string;
    logoURI: string;
    tokenName: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const tokensArray = await fetchTokens();
    const paths = tokensArray.slice(0, 100).map((token) => ({
      params: {
        chain: token.chainId.toString(),
        address: token.address,
      },
    }));

    return {
      paths,
      fallback: 'blocking', // ISR
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      paths: [],
      fallback: 'blocking', // ISR
    };
  }
};

export const getStaticProps: GetStaticProps<TokenDetailPageProps> = async ({ params }) => {
  try {
    const { chain, address } = params as { chain: string; address: string };
    const tokensArray = await fetchTokens();
    const token = tokensArray.find(
      (t) => t.chainId.toString() === chain && t.address === address
    );

    if (!token) {
      return { notFound: true };
    }

    return {
      props: {
        token: {
          chain: token.chainId,
          address: token.address,
          logoURI: token.logoURI || '',
          tokenName: token.name,
        },
      },
      revalidate: 60, // ISR
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    return { notFound: true };
  }
};

const TokenDetailPage = ({ token }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { chain, address, logoURI, tokenName } = token;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoriteTokens = cache.get('favoriteTokens') || new Set();
    const isFav = favoriteTokens.has(address);
    setIsFavorite(isFav);
  }, [address]);

  const handleFavoriteClick = () => {
    const favoriteTokens = cache.get('favoriteTokens') || new Set();
    if (favoriteTokens.has(address)) {
      favoriteTokens.delete(address);
    } else {
      favoriteTokens.add(address);
    }
    cache.set('favoriteTokens', favoriteTokens);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{tokenName}</h1>
      <img src={logoURI || "/default-logo.png"} alt={tokenName} className="w-20 h-20 rounded-full object-cover mb-4" />
      <p className="mb-2"><span className="font-bold">Address:</span> {address}</p>
      <p className="mb-4"><span className="font-bold">Chain ID:</span> {chain}</p>
      <button
        onClick={handleFavoriteClick}
        className={`px-4 py-2 rounded-md ${isFavorite ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
      </button>
    </div>
  );
};

export default TokenDetailPage;
