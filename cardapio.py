import requests 
import json
from datetime import date

data_atual = date.today()
data = '{}/{}/{}'.format(data_atual.day, data_atual.month,data_atual.year)
url = 'https://cobalto.ufpel.edu.br/portal/cardapios/cardapioPublico/listaCardapios?null=&txtData={}&cmbRestaurante=6&_search=false&nd=1666276511172&rows=10&page=1&sidx=refeicao asc, id&sord=asc'.format(data)
response = requests.get(url).json()
cardapio_obj = {}
print('DATA: ', data)
print('-----------------')
print('')
for row in response['rows'][3:6]:
	print(row['nome'])
	cardapio_obj[row['nome']] = row['descricao']
	print('({})'.format(row['descricao']).lower())
	print('')
print('-----------------')


with open('cardapio.json') as f:
	content = json.load(f)
content.update({data: cardapio_obj})

with open('cardapio.json', 'w', encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False)



