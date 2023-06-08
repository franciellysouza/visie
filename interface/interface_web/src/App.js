import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IndexPage() {
  const [pessoas, setPessoas] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [edicaoAtiva, setEdicaoAtiva] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/pessoas');
      setPessoas(response.data);
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerMais = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/pessoas/${id}`);
      setRegistroSelecionado(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditar = () => {
    setEdicaoAtiva(true);
  };

  const handleExcluir = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/pessoas/${id}`);
      fetchData();
      setRegistroSelecionado(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelar = () => {
    setEdicaoAtiva(false);
  };

  const handleAtualizar = async (id, dadosAtualizados) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/pessoas/${id}`, dadosAtualizados);
      fetchData();
      setEdicaoAtiva(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdicionar = async (novaPessoa) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/pessoas', novaPessoa);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderListaPessoas = () => {
    return (
      <div>
        <h2>Índice</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de Admissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa[0]}>
                <td>{pessoa[1]}</td>
                <td>{pessoa[5]}</td>
                <td>
                  <button onClick={() => handleVerMais(pessoa[0])}>Ver Mais</button>
                  <button onClick={handleEditar}>Editar</button>
                  <button onClick={() => handleExcluir(pessoa[0])}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Adicionar Pessoa</h2>
        <form onSubmit={handleAdicionar}>
          <label>Nome:</label>
          <input type="text" name="nome" />

          <label>Data de Admissão:</label>
          <input type="date" name="data_admissao" />

          <button type="submit">Adicionar</button>
        </form>
      </div>
    );
  };

  const renderRegistroSelecionado = () => {
    if (!registroSelecionado) {
      return null;
    }

    return (
      <div>
        <h2>Registro Selecionado</h2>
        <p>Nome: {registroSelecionado[1]}</p>
        <p>RG: {registroSelecionado[2]}</p>
        <p>CPF: {registroSelecionado[3]}</p>
        <p>Data de Nascimento: {registroSelecionado[4]}</p>
        <p>Data de Admissão: {registroSelecionado[5]}</p>
        <button onClick={handleEditar}>Editar</button>
        <button onClick={() => handleExcluir(registroSelecionado[0])}>Excluir</button>
      </div>
    );
  };

  const renderAtualizarRegistro = () => {
    if (!edicaoAtiva || !registroSelecionado) {
      return null;
    }

    return (
      <div>
        <h2>Atualizar Dados do Registro</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Nome:</label>
          <input type="text" name="nome" defaultValue={registroSelecionado[1]} />

          <label>RG:</label>
          <input type="text" name="rg" defaultValue={registroSelecionado[2]} />

          <label>CPF:</label>
          <input type="text" name="cpf" defaultValue={registroSelecionado[3]} />

          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="data_nascimento"
            defaultValue={registroSelecionado[4]}
          />

          <label>Data de Admissão:</label>
          <input
            type="date"
            name="data_admissao"
            defaultValue={registroSelecionado[5]}
          />

          <button onClick={() => handleAtualizar(registroSelecionado[0], {
            nome: document.getElementsByName('nome')[0].value,
            rg: document.getElementsByName('rg')[0].value,
            cpf: document.getElementsByName('cpf')[0].value,
            data_nascimento: document.getElementsByName('data_nascimento')[0].value,
            data_admissao: document.getElementsByName('data_admissao')[0].value,
          })}>Salvar</button>
          <button onClick={handleCancelar}>Cancelar</button>
        </form>
      </div>
    );
  };

  return (
    <div>
      {renderListaPessoas()}
      {renderRegistroSelecionado()}
      {renderAtualizarRegistro()}
    </div>
  );
}

export default IndexPage;
