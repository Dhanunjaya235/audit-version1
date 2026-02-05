import { BrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Routing from '@/components/layout/Routing';

function App() {
  return (
    <BrowserRouter basename='/audit/'>
      <Layout>
        <Routing />
      </Layout>
    </BrowserRouter>
  );
}

export default App;

