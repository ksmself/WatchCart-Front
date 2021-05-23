import { getPost } from '@api';
import { PageRouteProps } from '@constants';
import { f7, Navbar, NavRight, Page, Link } from 'framework7-react';
import React, { useEffect, useState } from 'react';

interface PostShowPageProps extends PageRouteProps {
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}

const PostShowPage = ({ f7route, f7router, setPosts }: PostShowPageProps) => {
  const postId = f7route.params.id;
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getPost(postId);
      setPost(data);
    })();
  }, []);

  return (
    <Page noToolbar>
      <Navbar title={post?.title} backLink backLinkForce={true}>
        <NavRight>
          <Link
            onClick={() => {
              f7.dialog
                .create({
                  title: '메뉴',
                  buttons: [
                    {
                      text: '게시글 수정',
                      onClick: () => {
                        f7router.navigate(`/posts/${post.id}/edit`, { props: { setPost, setPosts } });
                      },
                    },
                    {
                      text: '게시글 삭제',
                      onClick: () => {},
                    },
                  ],
                  verticalButtons: true,
                })
                .open();
            }}
            iconF7="ellipsis"
          ></Link>
        </NavRight>
      </Navbar>

      <div className="p-3">
        <h1 className="text-xl font-bold">{post?.title}</h1>
        <p className="mt-3">{post?.content}</p>
      </div>
    </Page>
  );
};

export default React.memo(PostShowPage);
