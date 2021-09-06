import React from 'react';
import { Link } from 'framework7-react';

const BottomToolBarContent = ({ currentIdx }) => (
  <div className="toolbar-flex">
    <Link
      href="/intro"
      text="Home"
      iconIos="f7:house"
      iconAurora="f7:house"
      iconMd="material:home"
      tabLinkActive={currentIdx === 0}
    />
    <Link
      href="/categories"
      text="Category"
      iconIos="f7:list_bullet"
      iconAurora="f7:list_bullet"
      iconMd="material:format_list_bulleted"
      tabLinkActive={currentIdx === 1}
    />
    <Link
      href="/star"
      text="Stars"
      iconIos="f7:star"
      iconAurora="f7:star"
      iconMd="material:star_outline"
      tabLinkActive={currentIdx === 2}
    />
    <Link
      href="/mypage"
      text="MyPage"
      iconIos="f7:person"
      iconAurora="f7:person"
      iconMd="material:person_outline"
      tabLinkActive={currentIdx === 3}
    />
  </div>
);

export default BottomToolBarContent;
