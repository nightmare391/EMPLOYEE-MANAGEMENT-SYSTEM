import { Switch, Route } from "wouter";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Search from "@/pages/search";
import AddEmployee from "@/pages/add-employee";
import Manage from "@/pages/manage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/search" component={Search} />
        <Route path="/add" component={AddEmployee} />
        <Route path="/manage" component={Manage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
