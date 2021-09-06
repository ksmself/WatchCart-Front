import { f7ready, Page, Toolbar, BlockTitle, Swiper, SwiperSlide, Block } from 'framework7-react';
import { sampleSize, zip } from 'lodash';
import React, { useEffect, useState } from 'react';
// import sanitizeHtml from '../js/utils/sanitizeHtml';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategories, getMovies } from '@api';
import RowSwiper from '@components/Swiper/RowSwiper';

const IntroPage = (props) => {
  const [categories, setCategories] = useState(null);
  const [slides, setSlides] = useState([]);
  const images: string[] = [
    'couple',
    'segment',
    'chilling',
    'choose',
    'chatting',
    'confirmed',
    'agreement',
    'grades',
    'brainstorming',
    'hiring',
    'love',
    'messages1',
    'development',
    'team',
    'together',
    'space',
    'mobile',
    'website',
    'easter',
    'romantic',
    'tasting',
    'drone',
    'coding',
    'mindfulness',
    'artificial',
    'celebration',
    'virtual',
    'doggy',
    'static',
    'healthy',
    'data',
    'sleep',
    'force',
    'makeup',
    'bicycle',
    'podcast',
    'fishing',
    'credit',
    'workout',
    'pilates',
    'group',
    'mouth',
    'school',
  ];

  useEffect(() => {
    f7ready(async (f7) => {
      setSlides(
        zip(sampleSize(images, 3), ['인썸니아의 사전<br/> 신입 교육용 앱입니다.', '여러분 파이팅!', '도큐 잘보세요!']),
      );
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategories(data);
    })();
  }, []);

  return (
    <Page className="theme-dark">
      <TopNavBar />
      <div className="container-box">
        {categories?.map((category) => (
          <div className="category-box" key={category?.id}>
            <BlockTitle className="block-title">{category?.title}</BlockTitle>
            <RowSwiper categoryId={category?.id} />
          </div>
        ))}
        <Block />
      </div>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent />
      </Toolbar>
      {/* <Toolbar bottom className="p-0" inner={false}>
        <div className="w-full flex">
          <Button className="w-full rounded-none" large href="/users/sign_in">
            로그인
          </Button>
          <Button className="w-full rounded-none" large href="/users/sign_up" fill>
            회원가입
          </Button>
        </div>
      </Toolbar> */}
      {/* <Swiper
        className="h-full"
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides
        pagination={{ clickable: true }}
        observer
      >
        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="flex justify-center p-0 ">
              <img src={`https://insomenia.com/svgs/${item[0]}`} alt="" />
            </div>

            {sanitizeHtml(item[1], { className: 'text-lg text-center pt-4' })}
          </SwiperSlide>
        ))}
      </Swiper> */}
    </Page>
  );
};
export default React.memo(IntroPage);
