from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Habilitar o CORS para todas as rotas

# Configurações do banco de dados
db_config = {
    'host': 'jobs.visie.com.br',
    'user': 'franciellyalmeida',
    'password': 'ZnJhbmNpZWxs',
    'database': 'franciellyalmeida',
    'port': 3306
}

def get_database_connection():
    connection = mysql.connector.connect(**db_config)
    return connection

@app.route('/api/pessoas', methods=['GET'])
def get_pessoas():
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM pessoas')
    pessoas = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(pessoas)

@app.route('/api/pessoas', methods=['POST'])
def add_pessoa():
    pessoa = request.get_json()
    nome = pessoa['nome']
    rg = pessoa['rg']
    cpf = pessoa['cpf']
    data_nascimento = pessoa['data_nascimento']
    data_admissao = pessoa['data_admissao']
    funcao = pessoa['funcao']

    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO pessoas (nome, rg, cpf, data_nascimento, data_admissao, funcao) VALUES (%s, %s, %s, %s, %s, %s)", (nome, rg, cpf, data_nascimento, data_admissao, funcao))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'message': 'Pessoa adicionada com sucesso.'})

@app.route('/api/pessoas/<int:id_pessoa>', methods=['PUT'])
def update_pessoa(id_pessoa):
    pessoa = request.get_json()
    nome = pessoa['nome']
    rg = pessoa['rg']
    cpf = pessoa['cpf']
    data_nascimento = pessoa['data_nascimento']
    data_admissao = pessoa['data_admissao']
    funcao = pessoa['funcao']

    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE pessoas SET nome = %s, rg = %s, cpf = %s, data_nascimento = %s, data_admissao = %s, funcao = %s WHERE id_pessoa = %s", (nome, rg, cpf, data_nascimento, data_admissao, funcao, id_pessoa))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'message': 'Pessoa atualizada com sucesso.'})

@app.route('/api/pessoas/<int:id_pessoa>', methods=['DELETE'])
def delete_pessoa(id_pessoa):
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM pessoas WHERE id_pessoa = %s", (id_pessoa,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'message': 'Pessoa excluída com sucesso.'})

if __name__ == '__main__':
    app.run(debug=True)
