import React, { useState } from 'react';
import './CreateArticle.styles.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/button.component';
import FormInput from '../../../components/FormInput/FormInput.component';
import Label from '../../../components/Label/Label.component';
import { createArticle } from '../../../Api/articles';
import { toast } from 'react-hot-toast';
import Editor from '../../../components/Editor2/Editor';
import TurndownService from 'turndown';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/user/user.selectors';

import WordIcon from '../../../assets/docx_icon.svg';
import PdfIcon from '../../../assets/PDF_file_icon.svg';
import PptIcon from '../../../assets/ppt.svg';
import XlsIcon from '../../../assets/xls.svg';

function CreateArticle() {
  const { _id, direction_departments, role } = useSelector(selectCurrentUser);
  let dir_deps = direction_departments;
  if (role === 'admin') {
    dir_deps = JSON.parse(import.meta.env.VITE_DIRECTION_DEPARTMENTS);
  }
  // const direction_departments = JSON.parse(import.meta.env.VITE_DIRECTION_DEPARTMENTS);

  const [direction, setDirection] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('Tanger Med Port Authority');
  const [description, setDescription] = useState(
    'Le groupe Tanger Med opère et développe des plateformes portuaires, logistiques et industrielles. Il gère le complexe portuaire Tanger Med, 1er port en Méditerranée et en Afrique. A travers sa participation de référence dans « Marsa Maroc », il est impliqué également dans les opérations de 9 autres ports du Royaume. Le volume total traité par le groupe est de 138 Millions de tonnes de marchandises et 8,1 millions de conteneurs EVP. Le groupe a également aménagé plus de 2000 Ha de zones d’activités économiques qui accueillent plus de 1100 entreprises et près de 95 000 emplois dans les secteurs de l’industrie automobile, l’aéronautique, le textile, l’agro-alimentaire et la logistique.'
  );
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState([]);
  const [showImage, setShowImage] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setShowImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  const onfileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const files = Array.from(event.target.files);
      console.log(files);

      setFile(files);
    }
  };
  const getDepartmentsByDirection = () => {
    if (!direction) return [];
    return dir_deps[direction].map((val) => ({
      value: val,
      text: val.split('_').join(' '),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    setLoading(true);

    if (file.length > 10) {
      setLoading(false);
      return toast.error(
        'Vous avez dépassé le nombre maximum de fichiers ( 10 )'
      );
    }

    const formData = new FormData();
    formData.append('author', _id);
    formData.append('direction', direction);
    if (department) formData.append('department', department);
    formData.append('description', description);
    formData.append('image', image);

    for (let i = 0; i < file.length; i++) {
      formData.append('files', file[i]);
    }

    formData.append('title', title);
    if (markdownContent) {
      formData.append('content', markdownContent);
    }

    try {
      const res = await createArticle(formData);

      toast.success(res.data.message);
      navigate('/articles');
    } catch (err) {
      console.log(err.message);
      const { data } = err.response;

      if (data.status === 'fail') {
        toast.error(data.message);
      } else if (data.status === 'error') {
        const { message, errors } = data;
        toast.error(`${message}`);
        console.error('errors ==> ', errors);
        setErrors(errors);
      }
    }

    setLoading(false);
  };

  const turndownService = new TurndownService();
  const markdownContent = turndownService.turndown(content);

  const getIcon = (name) => {
    const extention = name.slice(name.lastIndexOf('.') + 1);
    if (extention === 'pdf') return PdfIcon;
    else if (extention === 'docx') return WordIcon;
    else if (extention === 'pptx') return PptIcon;
    else return XlsIcon;
  };

  const handleRemoveFile = (f) => {
    setFile(file.filter((item) => item !== f));
  };

  return (
    <div className="create__article">
      <form onSubmit={handleSubmit}>
        {/* ========================================== */}

        <Label>Image</Label>

        <div className="upload__image">
          <label htmlFor="images" className="drop-container" id="dropcontainer">
            <input
              name="image"
              type="file"
              onChange={onImageChange}
              id="images"
              accept="image/jpeg, image/png"
              encType="multipart/form-data"
            />
          </label>
          {/* ========================================== */}
          {showImage && (
            <div className="image__preview">
              <img src={showImage} alt={'preview'} />
            </div>
          )}
        </div>

        <FormInput
          label={'Direction'}
          name="direction"
          required
          defaultOption="Veuillez choisir la direction "
          values={Object.keys(dir_deps).map((dir) => ({
            value: dir,
            text: dir.split('_').join(' '),
          }))}
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
          }}
        />

        {direction && dir_deps[direction].length > 0 && (
          <FormInput
            label={'Département'}
            name="department"
            required
            defaultOption="Veuillez choisir le département "
            values={getDepartmentsByDirection()}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
          />
        )}

        <FormInput
          label={'Titre'}
          placeholder=""
          type="text"
          name="title"
          error={errors['title']}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormInput
          label={'Description'}
          placeholder=""
          type="text"
          error={errors['description']}
          name="description"
          textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <Label>Contenu</Label>

          <Editor value={content} setValue={(v) => setContent(v)} />
        </div>

        <div className="files__input">
          <Label>Fichiers</Label>
          {/* <input type="file" name="files" multiple onChange={onfileChange} /> */}

          <label className="drop-container" id="dropcontainer">
            <input
              name="files"
              type="file"
              // value={file}
              onChange={onfileChange}
              encType="multipart/form-data"
              multiple
              accept="
                        application/pdf,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/vnd.openxmlformats-officedocument.presentationml.presentation,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </label>
        </div>

        <div className="selected__files">
          <h3>Fichiers sélectionnés</h3>

          {file.length > 0 ? (
            file.map((f) => (
              <div className="flex-center item" key={f.name}>
                <img className="icon" src={getIcon(f.name)} alt="icon" />

                <span className="name">{f.name}</span>
                <DeleteIcon onClick={() => handleRemoveFile(f)} />
              </div>
            ))
          ) : (
            <div className="empty">Aucun fichier sélectionné</div>
          )}
        </div>

        {/* <Button width={200} loading={loading}> */}
        <Button loading={loading}>Ajouter</Button>
      </form>
    </div>
  );
}

export default CreateArticle;
