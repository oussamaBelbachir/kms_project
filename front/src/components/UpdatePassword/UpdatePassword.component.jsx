import React, { useState } from 'react';
import Button from '../Button/button.component';
import FormInput from '../FormInput/FormInput.component';
import './UpdatePassword.styles.scss';
import { updatePassword } from '../../Api/auth';
import { toast } from 'react-hot-toast';

function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [FormFields, setFormFields] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormFields({ ...FormFields, [name]: value });
  };
  const { currentPassword, password, confirmPassword } = FormFields;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPasswordError('');

    if (password !== confirmPassword) {
      toast.error('Confirmation du mot de passe incorrect');
      return;
    }
    setLoading(true);
    try {
      const res = await updatePassword(FormFields);
      toast.success(res.data.message);
      setFormFields({ currentPassword: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.log('Err =====> ', err);
      const {
        response: { data },
      } = err;
      console.log(data.message);
      setCurrentPasswordError(data.message);
      toast.error(data.message);
    }

    setLoading(false);
  };

  return (
    <div className="update__password">
      <h2>Modifier le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label={'Mot de passe actuel'}
          name="currentPassword"
          required
          type="password"
          value={currentPassword}
          onChange={handleChange}
          error={currentPasswordError}
        />

        <FormInput
          label={'Nouveau mot de passe'}
          name="password"
          required
          type="password"
          value={password}
          onChange={handleChange}
        />

        <FormInput
          label={'Confirmation du mot de passe'}
          name="confirmPassword"
          required
          type="password"
          value={confirmPassword}
          onChange={handleChange}
        />
        <Button loading={loading}>Modifier</Button>
      </form>
    </div>
  );
}

export default UpdatePassword;
