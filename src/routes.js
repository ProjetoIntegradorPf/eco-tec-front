import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import BasePage from "./components/BasePage";
import Donations from "./components/Donations";
import Sales from "./components/Sales";
import Resume from "./components/Resume";
import Castrations from "./components/Castrations";
import CashDonations from "./components/CashDonations";
import NiscExpenses from "./components/MiscExpenses";

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<App />} />
      <Route
        path="/doacoes"
        element={<BasePage showLogin={false} Component={Donations} />}
      />
      <Route
        path="/doacoescash"
        element={<BasePage showLogin={false} Component={CashDonations} />}
      />
      <Route
        path="/vendas"
        element={<BasePage showLogin={false} Component={Sales} />}
      />

      <Route
        path="/castracoes"
        element={<BasePage showLogin={false} Component={Castrations} />}
      />

      <Route
        path="/despesas"
        element={<BasePage showLogin={false} Component={NiscExpenses} />}
      />

      <Route
        path="/resumo-geral"
        element={<BasePage showLogin={false} Component={Resume} />}
      />
      {/* <Route
				path="/receitas"
				element={
					<BasePage>
						<Table key="receitas" />
					</BasePage>
				}
			/> */}
    </Routes>
  );
}

export default MainRoutes;
