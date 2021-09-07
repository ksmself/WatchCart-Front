/** @tsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Main Page
 */
export const title = css`
  color: #f82f62;
`;

export const containerBox = css`
  padding: 20px 15px;
`;

export const categoryBox = css`
  margin-bottom: 15px;
`;

export const blockTitle = css`
  margin-bottom: 10px;
  font-weight: 700;
`;

export const movieLink = css`
  display: flex;
  flex-direction: column;

  img {
    margin-bottom: 7px;
  }

  div {
    display: -webkit-box;
    width: 100%;
    font-size: 10px;
    /*2줄로 제한*/
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const toolbarFlex = css`
  display: flex;
  justify-content: space-around;
  width: 100%;

  .icon {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

/**
 * Movies/:id Page
 */
export const movieContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;

  img {
    width: 95%;
    height: 200px;
  }
`;
