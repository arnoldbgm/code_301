import { InputNumber, Table } from "antd";
import { Select } from "antd";
import { Button, Input } from "antd";
import { Form } from "antd";
import { useState } from "react";

export default function ProductoPage() {

   // Para trabajar con el localStorage en React
   // Usen useState

   const [data, setData] = useState([])

   // Para lograr la limpieza del formulario
   const [form] = Form.useForm();

   // Vamos a crear las columnas de nuestra tabla de ant
   const columns = [
      {
         title: 'Nombre',
         dataIndex: 'nombre',
         key: 'nombre',
      },
      {
         title: 'Precio',
         dataIndex: 'precio',
         key: 'precio',
      },
      {
         title: 'Stock',
         dataIndex: 'stock',
         key: 'stock',
      },
      {
         title: 'Categoria',
         dataIndex: 'categorias',
         key: 'categoria'
      }
   ];

   // Para visualizar la informacion que se envia
   function guardarDatos(values) {
      const datosAgregados = [...data, values]
      setData(datosAgregados)
      console.log(data)
      form.resetFields()
   }

   return (
      <div>
         <Form form={form} onFinish={guardarDatos}>
            <Form.Item
               label="Nombre Producto"
               name="nombre"
               rules={[{ required: true, message: 'Llena esta campo por favor' }]}
            >
               <Input />
            </Form.Item>

            <Form.Item
               label="Precio"
               name="precio"
               rules={[{ required: true, message: 'Llena esta campo por favor' }]}
            >
               <InputNumber />
            </Form.Item>

            <Form.Item
               label="Stock"
               name="stock"
               rules={[{ required: true, message: 'Llena esta campo por favor' }]}
            >
               <InputNumber />
            </Form.Item>

            <Form.Item
               label="Categorias"
               name="categorias"
               rules={[{ required: true, message: 'Llena esta campo por favor' }]}
            >
               <Select options={[
                  { value: 'electronica', label: "Electronica" },
                  { value: 'celulares', label: "Celulares" },
                  { value: 'deporte', label: "Deportes" }
               ]} />
            </Form.Item>

            <Form.Item>
               <Button type="primary" htmlType="submit">Enviar</Button>
            </Form.Item>
         </Form>

         <Table dataSource={data} columns={columns}/>
      </div>
   )
}