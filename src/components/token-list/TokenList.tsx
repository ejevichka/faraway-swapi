import React, { useState, useMemo, useEffect } from "react";
import cache from '~/utils/cache';
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import { TToken, TTokenFilter } from "~/lib/api";
import TokenRow from "~/components/token-list/Row"


/* const chainOptions = Object.entries()
  .filter(([key, value]) => typeof value === 'number')
  .map(([key, value]) => (
    <option key={value as number} value={value as number}>
      {key}
    </option>
  )); */

const TokenList = ({ data }: { data: TToken[] }) => {
  const [filter, setFilter] = useState<TTokenFilter>({
    chainId: 1,
    chainType: "",
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const favoriteTokens = cache.get('favoriteTokens') || new Set();
    setFavorites(favoriteTokens);
  }, []);


  const filteredAndSortedData = useMemo(() => {
    const filteredTokens: TToken[] = data.filter( token => {
      return (
        (!filter.chainId || token.chainId === filter.chainId) &&
        (!filter.chainType || token.chainType === filter.chainType)
      );
      });
  
    const favoriteTokens: TToken[] = filteredTokens.filter(token => favorites.has(token.address));
    const nonFavoriteTokens: TToken[] = filteredTokens.filter(token => !favorites.has(token.address));
    return [...favoriteTokens, ...nonFavoriteTokens];
  }, [data, filter, favorites]);

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const token = filteredAndSortedData[index];
    const isFavorite = token ? favorites.has(token.address) : false;
    return <TokenRow index={index} style={style} data={token as TToken} isFavorite={isFavorite} />;
  };


  return (
    <div>
      <div className="controls">
        <select
          value={filter.chainId}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              chainId: parseInt(e.target.value, 10),
            }))
          }
          data-testid="chain-id-select"
          className="m-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:inline-block sm:w-auto sm:text-sm"
        >
          <option value="0">Select Chains</option>
         
          <option></option>     
        </select>
        <select
          value={filter.chainType}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              chainType: e.target.value,
            }))
          }
          data-testid="chain-type-select"
          className="m-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:inline-block sm:w-auto sm:text-sm"
        >
          <option value="">Select Chain Types</option>
          <option value="EVM">EVM</option>
          <option value="SVM">SVM</option>
        </select>
      </div>
      <List
        height={600}
        itemCount={filteredAndSortedData.length}
        itemSize={70}
        width="100%"
      >
        {renderRow}
      </List>
    </div>
  );
};

export default TokenList;
