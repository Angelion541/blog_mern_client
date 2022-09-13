import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../utils/axios';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const inputFileRef = useRef(null);
  const isEditing = Boolean(postId);
  const [dataOfNewPost, setDataOfNewPost] = useState({
    title: '',
    tags: '',
    text: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (postId) {
      axios
        .get(`/posts/${postId}`)
        .then(({ data: res }) => setDataOfNewPost({ ...res, tags: res.tags.join(', ')}))
        .catch(err => {
          console.warn(err);
          alert('Can`t load post!');
        });
    }
  }, [postId])

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setDataOfNewPost(prev => ({ ...prev, imageUrl: `http://localhost:4000${data.url}` }))
    } catch (error) {
      console.warn(error);
      alert('Can`t upload image!');
    }
  };

  const onClickRemoveImage = () => {
    setDataOfNewPost(prev => ({ ...prev, imageUrl: '' }));
  };

  const onChange = React.useCallback((value) => {
    setDataOfNewPost(prev => ({ ...prev, text: value }));
  }, []);

  const onSubmit = async () => {
    try {
      const newPost = {
        ...dataOfNewPost,
        imageUrl: dataOfNewPost.imageUrl,
        tags: dataOfNewPost.tags.split(',')
      }
      const { data } = isEditing
        ? await axios.patch(`/posts/${postId}`, newPost)
        : await axios.post('/posts', newPost);
      const id = isEditing ? postId : data._id;
      navigate(`/posts/${id}`);
    } catch (error) {
      console.warn(error);
      alert('Can`t create post!');
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {dataOfNewPost.imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={dataOfNewPost.imageUrl} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={dataOfNewPost.title}
        onChange={e => setDataOfNewPost(prev => ({ ...prev, title: e.target.value }))}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={dataOfNewPost.tags}
        onChange={e => setDataOfNewPost(prev => ({ ...prev, tags: e.target.value }))}
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={dataOfNewPost.text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large" >Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};