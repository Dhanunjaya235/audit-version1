import { BrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Routing from '@/components/layout/Routing';
import { BASENAME } from '@/constants/index';

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Layout>
        <Routing />
      </Layout>
    </BrowserRouter>
  );
}

export default App;

