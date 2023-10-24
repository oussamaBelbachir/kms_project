import React, { Fragment, useEffect, useState } from 'react';
import './ArticleDetails.styles.scss';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../../../Api/articles';
import Loading from '../../../components/Loading/Loading.component';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Button from '../../../components/Button/Button.component';
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import Files from '../../../components/Files/Files.component';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import NoResultsFound from '../../../components/NoResultsFound/NoResultsFound.component';

function ArticleDetails() {
  const user = useSelector(selectCurrentUser);

  let { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Article Détail';
    setLoading(true);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await getArticleById(id);
        const { article } = res.data;
        setArticle(article);
      } catch (err) {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!article) {
    return <NoResultsFound />;
  }

  const { author, direction, department } = article;

  return (
    <div className="article__details">
      <div className="direction">
        <DirectionsIcon className="direction__icon" />
        <span>
          <Link to={`/articles/${direction}`}>
            {direction.split('_').join(' ')}
          </Link>
        </span>

        {department && (
          <Fragment>
            <span className="space">
              <ArrowRightIcon />
            </span>
            <span>
              <Link to={`/articles/${direction}/${department}`}>
                {department.split('_').join(' ')}
              </Link>
            </span>
          </Fragment>
        )}
      </div>

      <div className="flex-between">
        <div className="posted_by flex-center">
          <div className="avatar">
            <Avatar
              sx={{ width: 50, height: 50 }}
              alt="Oussama belbachir"
              src="https://us.123rf.com/450wm/deagreez/deagreez1607/deagreez160700297/60465015-portrait-of-attractive-happy-young-man-in-glasses-on-gray-background.jpg?ver=6"
            />
          </div>
          <div className="posted_by__info">
            <div className="fullname">
              {author
                ? `${author.first_name} ${author.last_name}`
                : 'oussama belbachir'}
            </div>
            <div className="date">
              posté le {moment(article.createdAt).format('YYYY/MM/DD kk:mm:ss')}
            </div>
          </div>
        </div>
        {(user.role === 'admin' || user._id === author?._id) && (
          <div className="update">
            <Button nomargin fitContent>
              <EditIcon />
              <span>Modifier</span>
            </Button>
          </div>
        )}
      </div>

      <h1 className="title">{article.title}</h1>
      <div className="description">
        <p>{article.description}</p>
      </div>
      {article.content && (
        <div className="content">
          <ReactMarkdown
            children={article.content}
            remarkPlugins={[remarkGfm]}
          />
        </div>
      )}

      <div className="files">
        <Files files={article.files} />
      </div>
    </div>
  );
}

export default ArticleDetails;
