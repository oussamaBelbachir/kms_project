import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Articles from './routes/Articles/Articles.component';
import MainLayout from './layouts/MainLayout/MainLayout.component';
import SignIn from './routes/SignIn/SignIn.component';
import CheckUser from './components/CheckUser.component';
import RedirectIfAuthenticated from './permissions/RedirectIfAuthenticated.component';
import RequireAuth from './permissions/RequireAuth.component';
import PageNotFound from './routes/PageNotFound/PageNotFound.component';
import Users from './routes/Users/Users.component';
import ListOfArticles from './routes/Articles/ListOfArticles/ListOfArticles.component';
import RestrictTo from './permissions/RestrictTo.component';
import Profile from './routes/Profile/Profile.component';
import SmoothScroll from './utils/SmoothScroll';

function App() {
  return (
    <div className="app">
      <SmoothScroll>
        <Routes>
          <Route path="/connexion" element={<RedirectIfAuthenticated />}>
            <Route index element={<SignIn />} />
          </Route>

          <Route path="/" element={<RequireAuth />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<ListOfArticles />} />
              <Route path="/articles/*" element={<Articles />} />

              <Route path="/users/*" element={<RestrictTo roles={['admin']} />}>
                <Route path="*" element={<Users />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>
      </SmoothScroll>
    </div>
  );
}

export default CheckUser(App);
