import React from "react";
import { Routes, Route } from "react-router-dom";
import ListOfArticles from "./ListOfArticles/ListOfArticles.component";
import CreateArticle from "./CreateArticle/CreateArticle.component";
import ArticleDetails from "./ArticleDetails/ArticleDetails.component";
import RestrictTo from "../../permissions/RestrictTo.component";

function Articles() {
  return (
    <Routes>
      <Route index element={<ListOfArticles />} />

      <Route path="/id/:id" element={<ArticleDetails />} />
      <Route path="/:direction/:department?" element={<ListOfArticles />} />

      <Route
        path="/ajouter"
        element={<RestrictTo roles={["admin", "editor"]} />}
      >
        <Route index element={<CreateArticle />} />
      </Route>
    </Routes>
  );
}

export default Articles;
