import React, { Fragment } from 'react';
import './ArticleItem.styles.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo.component';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Avatar from '@mui/material/Avatar';

function ArticleItem({ article }) {
  const { _id, title, createdAt, direction, department, description, image } =
    article;

  const formatText = (text, max) => {
    if (text.length < max) return text.split('_').join(' ');
    return (
      text
        .split('')
        .slice(0, max + 1)
        .join('')
        .split('_')
        .join(' ') + '...'
    );
  };

  const link = `/articles/id/${_id}`;

  const minio_endPoint = import.meta.env.VITE_MINIO_ENDPOINT;
  const minio_port = import.meta.env.VITE_MINIO_PORT;
  return (
    <Link to={link}>
      <div className="article_item">
        <div className="article_infos">
          <div className="date">
            posté le {moment(createdAt).format('YYYY/MM/DD kk:mm:ss')}
          </div>
          {/*  */}
          {/* <div className="author flex-center">
            <Avatar
              sx={{ width: 29, height: 29 }}
              className="avatar"
              alt="Oussama belbachir"
              src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            />
            <span className="fullname">Oussama Belbachir</span>
          </div> */}
          {/*  */}
          <h2 className="title">{title}</h2>
          <div className="description">{formatText(description, 129)}</div>
          <div className="tags">
            <div className="item">
              {/* <span className="direction__large">
                {formatText(direction, 8)}
              </span> */}
              <span className="direction">
                {formatText(direction, department ? 10 : 100)}
              </span>

              {department && (
                <Fragment>
                  <ArrowRightIcon />
                  <span className="department">
                    {department.split('_').join(' ')}
                  </span>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        <div className="article_image">
          {image ? (
            <img
              alt="article_image"
              src={`${minio_endPoint}:${minio_port}/${image}`}
            />
          ) : (
            <Logo />
          )}
        </div>
      </div>
    </Link>
  );
}

export default ArticleItem;
