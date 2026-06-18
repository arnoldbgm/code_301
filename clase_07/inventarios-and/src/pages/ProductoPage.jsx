import { InputNumber } from "antd";
import { Select } from "antd";
import { Button, Input } from "antd";
import { Form } from "antd";

export default function ProductoPage() {
   return (
      <div>
         <Form>
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
                  {value: 'electronica', label:"Electronica"},
                  {value: 'celulares', label:"Celulares"},
                  {value: 'deporte', label: "Deportes"}
               ]}/>
            </Form.Item>

            <Form.Item>
               <Button type="primary" htmlType="submit">Enviar</Button>
            </Form.Item>
         </Form>
      </div>
   )
}