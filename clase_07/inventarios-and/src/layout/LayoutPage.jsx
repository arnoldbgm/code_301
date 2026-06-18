import { AndroidFilled, PieChartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';


const { Header, Footer, Sider, Content } = Layout;

export default function LayoutPage() {
   return (
      <div>
         <Layout >
            <Sider className='h-screen'>
               <Menu
                  theme='dark'
                  items={[
                     {
                        key: "1",
                        icon: <PieChartFilled />,
                        label: "Inventario"
                     },
                     {
                        key: "2",
                        icon: <AndroidFilled />,
                        label: "Ventas",
                        children: [
                           { key: '5', label: 'Option 5' },
                           { key: '6', label: 'Option 6' },
                           { key: '7', label: 'Option 7' },
                           { key: '8', label: 'Option 8' },
                        ],
                     }
                  ]}
               />
            </Sider>
            <Layout>
               <Header>
                  <span className='text-white text-2xl'>
                     <ShoppingCartOutlined /> Sistema de Inventarios
                  </span>
               </Header>
               <Content>
                  <Outlet/>
               </Content>
               <Footer>
                  <div className='border w-full'>
                     Derechos reservados Sistema de Inventarios
                  </div>
               </Footer>
            </Layout>
         </Layout>
      </div>
   )
}