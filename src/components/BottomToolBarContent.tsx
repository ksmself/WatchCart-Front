import React from 'react';
import { Link } from 'framework7-react';

const BottomToolBarContent = () => (
  <div className="toolbar-flex">
    <Link href="/intro" text="Home" iconIos="f7:house" iconAurora="f7:house" iconMd="material:home" tabLinkActive />
    <Link
      href="/categories"
      text="Category"
      iconIos="f7:list_bullet"
      iconAurora="f7:list_bullet"
      iconMd="material:format_list_bulleted"
    />
    <Link href="/star" text="Star" iconIos="f7:star" iconAurora="f7:star" iconMd="material:star_outline" />
    <Link href="/mypage" text="MyPage" iconIos="f7:person" iconAurora="f7:person" iconMd="material:person_outline" />
  </div>
);

export default BottomToolBarContent;
