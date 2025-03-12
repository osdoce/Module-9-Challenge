import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City{
  name: string;
  id: string;

  constructor(name: string = "", id:string = "") {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<string> {
    //console.log(`reading`);
    // el fs.readFile ya regresa un string
    const lecturaHistoria = await fs.readFile('./db/searchHistory.json', 'utf8');
    return lecturaHistoria;
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) { 
    await fs.writeFile('./db/searchHistory.json', JSON.stringify(cities, null, 2));
  }

 //retunrs City array
  async getCities(): Promise<City[]> {
    const lecturaHistoria: string = await this.read();
    const historiaCity: City[] = JSON.parse(lecturaHistoria) || [];
    //console.log("History:", historiaCity);
    return historiaCity;
 }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const newCity: City = {
      name: city,
      id: uuidv4(),
    }
    const ciudades: City[] = await this.getCities();
    
    //Check if the city exists
    if (ciudades.some(ciudad => ciudad.name === newCity.name)) {
      console.log("Si entra al if");
      this.write(ciudades); 
    } else {
      ciudades.push(newCity);
      this.write(ciudades);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const ciudades: City[] = await this.getCities();
    const ciudadesFiltradas: City[] = ciudades.filter((ciudad: City) => ciudad.id !== id);
    if (ciudadesFiltradas.length === ciudades.length) {
      console.log("Sin ciudades filtradas");
    }
    this.write(ciudadesFiltradas); 
  }
}

export default new HistoryService();
