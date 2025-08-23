import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { aprovarPostPendiente, POST_TYPES_APROVE } from '../../redux/actions/postAproveAction';
import { deletePost } from '../../redux/actions/postAction';
import { useHistory, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PostCard from '../PostCard';

const PostsPendientes = () => {
  const { homePostsAprove, auth, socket, languageReducer } = useSelector((state) => state);
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'es';

  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [postsPendientes, setPostsPendientes] = useState([]);

  useEffect(() => {
    if (homePostsAprove && homePostsAprove.posts) {
      const postspedientes = homePostsAprove.posts.filter((p) => p.estado === 'pendiente');
      setPostsPendientes(postspedientes);
    }
  }, [homePostsAprove]);

  const handleLoadMore = async () => {
    setLoad(true);
    const page = homePostsAprove.page || 1;
    const res = await getDataAPI(`posts/pendientes?limit=${page * 9}`, auth.token);
    dispatch({
      type: POST_TYPES_APROVE.GET_POSTS_PENDIENTES,
      payload: { ...res.data, page: page + 1 },
    });
    setLoad(false);
  };

  const handleAprovePost = (post) => {
    if (window.confirm(t('confirm.approve'))) {
      dispatch(aprovarPostPendiente({ post, auth,socket }));
      history.push("/postspendientes");
    }
  };

  const handleDeletePost = (post) => {
    if (window.confirm(t('confirm.delete'))) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/postspendientes");
    }
  };

  const handleBlockUser = (user) => {
    if (window.confirm(t('confirm.block', { user: user.username }))) {
      // dispatch(blockUserAction({ user, auth }));
    }
  };

  return (
    <div className="container mt-4"  >
      <h5 className="mb-3 text-center">
        {t('totalPending', { count: homePostsAprove.length })}
      </h5>

      <div className="post_thumb">
            {
                homePostsAprove.posts.map(post => (
                    <PostCard key={post._id} post={post}   />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            
            <LoadMoreBtn result={homePostsAprove.result} page={homePostsAprove.page}
            load={load} handleLoadMore={handleLoadMore} />
        </div>
    </div>
  );
};

export default PostsPendientes;
