import React, { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { Form, Col, Button, Table } from "react-bootstrap";
import Header from '../components/Header/index';
import Head from 'next/head';
import axios from "axios";

interface IRolls {
  id: any;
  name: String;
  action: String;
  roll: Number[];
  dificulty: Number;
  success: Number;
}

export default function Rolador() {
  const [nome, setNome] = useState("");
  const [acao, setAcao] = useState("");
  const [dice, setDice] = useState(1);
  const [dificuldade, setDificuldade] = useState(6);
  const [sucessos, setSucessos] = useState(0);
  const [rolagem, setRolagem] = useState([1]);
  const [rollsList, setRollsList] = useState<IRolls[]>([]);

  useEffect(() => {
    loadRolls();
  }, []);

  async function loadRolls() {
    const response = await axios.get('/api/rolls');
    setRollsList(response.data);
    console.log(response.data)
  }

  async function addToList(e: FormEvent) {
    e.preventDefault();
    await axios.post('/api/rolls', {
      name: nome,
      action: acao,
      roll: rolagem,
      dificulty: dificuldade,
      success: sucessos,
    });
    loadRolls();
  }

  const roll = async () => {
    var dice1 = [...Array(dice)].map(() => Math.floor(Math.random() * 10 + 1));
    console.log(dice1);
    setRolagem(dice1);
  };

  return (
    <>
      <br />
      <div className="container">
        <Form onSubmit={addToList}>
          <Form.Row>
            <Form.Group as={Col} type="text">
              <Form.Label>Nome do Personagem</Form.Label>
              <Form.Control
                placeholder="João da Silva"
                type="text"
                name="nome"
                onChange={(event) => {
                  setNome(event.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} type="text">
              <Form.Label>Ação</Form.Label>
              <Form.Control
                placeholder="Pular o muro"
                type="text"
                name="acao"
                onChange={(event) => {
                  setAcao(event.target.value);
                }}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Rolar quantos dados?</Form.Label>
              <Form.Control
                as="select"
                defaultValue="1"
                onChange={(event) => {
                  setDice(parseInt(event.target.value));
                }}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} type="text">
              <Form.Label>Dificuldade</Form.Label>
              <Form.Control
                placeholder="6"
                type="text"
                name="dificuldade"
                onChange={(event) => {
                  setDificuldade(parseInt(event.target.value));
                }}
              />
            </Form.Group>
            <Form.Group as={Col} type="text">
              <Form.Label>+ Sucessos</Form.Label>
              <Form.Control
                placeholder="0"
                type="text"
                name="sucessos"
                onChange={(event) => {
                  setSucessos(parseInt(event.target.value));
                }}
              />
            </Form.Group>
          </Form.Row>

          <Button variant="dark" type="submit" onClick={roll}>
            Rolar
          </Button>
        </Form>
      </div>

      <br />

      <div className="container">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ação</th>
              <th>Rolagem</th>
              <th>Dificuldade</th>
              <th>Sucessos</th>
            </tr>
          </thead>

          {rollsList.map((rolls) => (
            <tbody>
              <tr key={rolls.id}>
                <td>{rolls.name}</td>
                <td>{rolls.action}</td>
                <td>{rolls.roll.toString()}</td>
                <td>{rolls.dificulty}</td>
                <td>{rolls.roll.filter(item => item >= rolls.dificulty).length} + {rolls.success}</td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>
    </>
  );
}
