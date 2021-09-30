import { Block, Col, Link, Row } from 'framework7-react';
import React from 'react';

import { API_URL } from '@api';

const ColSwiper = ({ item }) => (
  <>
    <Block className="colswiper-block mb-10">
      {item?.map((i, idx, itemArr) => {
        if (idx % 2 === 0) {
          return (
            <Row key={i.id} className="colswiper-row">
              <Col width="50" className="colswiper-col">
                <Link href={`/movies/${itemArr[idx]?.id}`}>
                  <img
                    src={`${API_URL}${itemArr[idx].image ? itemArr[idx].image.url : itemArr[idx].image_path}`}
                    alt={itemArr[idx]?.title}
                  />
                </Link>
                <div>{itemArr[idx]?.title}</div>
              </Col>
              {idx + 1 < itemArr.length && (
                <Col width="50" className="colswiper-col">
                  <Link href={`/movies/${itemArr[idx + 1]?.id}`}>
                    <img
                      src={`${API_URL}${
                        itemArr[idx + 1].image ? itemArr[idx + 1].image.url : itemArr[idx + 1].image_path
                      }`}
                      alt={itemArr[idx + 1]?.title}
                    />
                  </Link>
                  <div>{itemArr[idx + 1]?.title}</div>
                </Col>
              )}
            </Row>
          );
        }
      })}
    </Block>
    {!item && <div className="content-null">아직 보고싶어요한 작품이 없습니다</div>}
  </>
);

export default ColSwiper;
