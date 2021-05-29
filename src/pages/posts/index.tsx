import { getPosts } from '@api';
import { PageRouteProps, Post } from '@constants';
import { Navbar, Page, List, ListItem, Fab, Icon } from 'framework7-react';
import React, { useEffect, useState } from 'react';

const PostIndexPage = ({ f7route, f7router }: PageRouteProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await getPosts();
      console.log(data);
      setPosts(data);
    })();
  }, []);

  return (
    <Page noToolbar>
      <Navbar title="게시글 목록" backLink={true}></Navbar>

      <Fab
        onClick={() =>
          f7router.navigate('/posts/new', {
            props: { setPosts },
          })
        }
        position="center-bottom"
        slot="fixed"
        text="게시글 작성"
        color="red"
      >
        <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
      </Fab>

      <List>
        {posts.map((post) => (
          <ListItem
            onClick={() => {
              f7router.navigate(`/posts/${post.id}`, { props: { setPosts } });
            }}
            key={post.id}
            title={post.title}
            after={post.user.email.split('@')[0]}
          ></ListItem>
        ))}
      </List>
    </Page>
  );
};

export default React.memo(PostIndexPage);
