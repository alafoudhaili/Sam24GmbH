import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private counterKey = 'quoteCounter'; // Key to store the counter in localStorage

  constructor() {
      if (!localStorage.getItem(this.counterKey)) {
      localStorage.setItem(this.counterKey, '1');
    }
   }

  async generateQuotePDF(requestData: any, companyInfo: any, rooms: any[]): Promise<void> {
    // Create a temporary div to hold the quote content
    const quoteElement = this.createQuoteHTML(requestData, companyInfo, rooms);
    
    // Append to body temporarily (hidden)
    document.body.appendChild(quoteElement);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(quoteElement, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove the temporary element
      document.body.removeChild(quoteElement);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
        const counter = this.getCounter();
    
    // Increment the counter for the next quote number
    this.incrementCounter();
      // Generate filename
      const filename = `Umzugsangebot_${requestData.clientName?.replace(/\s+/g, '_')}_${this.getCurrentDateString()}-${counter}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: open print dialog
      window.print();
    }
  }

  private createQuoteHTML(requestData: any, companyInfo: any, rooms: any[]): HTMLElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '800px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.4';
    container.style.color = '#333';
    container.style.padding = '30px';

    const quoteNumber = this.generateQuoteNumber();
    const currentDate = this.getCurrentDate();

    container.innerHTML = `
      <div style="margin-bottom: 30px;">
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px; border-bottom: 3px solid #f0da1a; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 60px; height: 60px; background: #f0da1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
              ${companyInfo.name.substring(0, 2)}
            </div>
            <h1 style="font-size: 24px; font-weight: bold; color: #f0da1a; margin: 0;">${companyInfo.name}</h1>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div style="margin-bottom: 4px; color: #666;"><strong>Geschäftsführer:</strong> ${companyInfo.geschaeftsfuehrer}</div>
            <div style="margin-bottom: 4px; color: #666;"><strong>Email:</strong> ${companyInfo.email}</div>
            <div style="margin-bottom: 4px; color: #666;"><strong>Telefon:</strong> ${companyInfo.telephone}</div>
            <div style="margin-bottom: 4px; color: #666;"><strong>Website:</strong> ${companyInfo.website}</div>
            <div style="margin-bottom: 4px; color: #666;"><strong>Adresse:</strong> ${companyInfo.address}</div>
          </div>
        </div>

        <!-- Quote Title -->
        <div style="text-align: center; padding: 25px; background: #f0da1a; color: white; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">UMZUGSANGEBOT</h2>
          <div style="font-size: 14px; margin: 5px 0;">Angebot Nr.: ${quoteNumber}</div>
          <div style="font-size: 14px; margin: 5px 0;">Datum: ${currentDate}</div>
        </div>

        <!-- Customer Information -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h3 style="color: #f0da1a; font-size: 16px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Kundeninformationen</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Name:</span>
              <span style="color: #333;">${requestData.clientName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Email:</span>
              <span style="color: #333;">${requestData.clientEmail}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Telefon:</span>
              <span style="color: #333;">${requestData.phone}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Umzugsdatum:</span>
              <span style="color: #333;">${this.formatDate(requestData.umzugdate)}</span>
            </div>
          </div>
        </div>

        <!-- Moving Details -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h3 style="color: #f0da1a; font-size: 16px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Umzugsdetails</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Von:</span>
              <span style="color: #333;">${requestData.departPoint}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Nach:</span>
              <span style="color: #333;">${requestData.arrivalPoint}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Entfernung:</span>
              <span style="color: #333;">${requestData.distanceKm} km</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa;">
              <span style="font-weight: bold; color: #555;">Gesamtvolumen:</span>
              <span style="color: #333;">${requestData.totalVolumeM3?.toFixed(2)} m³</span>
            </div>
          </div>
        </div>

        <!-- Price Table -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h3 style="color: #f0da1a; font-size: 16px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Preisaufstellung</h3>
          ${this.generatePriceTable(requestData)}
        </div>

        ${this.generateRoomsSection(requestData, rooms)}

        <!-- Total Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
            <span>Zwischensumme:</span>
            <span>${requestData.totalPrice?.toFixed(2)} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
            <span>MwSt. (19%):</span>
            <span>${(requestData.totalPrice * 0.19)?.toFixed(2)} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #f0da1a; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #f0da1a;">
            <span>Gesamtsumme:</span>
            <span>${(requestData.totalPrice * 1.19)?.toFixed(2)} €</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 25px; background: #f8f9fa; font-size: 11px; margin-top: 30px;">
          <div>
            <h4 style="color: #f0da1a; margin-bottom: 8px; font-size: 13px;">Zahlungsbedingungen</h4>
            <p>Zahlung innerhalb von 14 Tagen nach Rechnungsstellung ohne Abzug.</p>
          </div>
          <div>
            <h4 style="color: #f0da1a; margin-bottom: 8px; font-size: 13px;">Gültigkeit</h4>
            <p>Dieses Angebot ist 30 Tage gültig.</p>
          </div>
          <div>
            <h4 style="color: #f0da1a; margin-bottom: 8px; font-size: 13px;">Hinweise</h4>
            <p>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.</p>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  private generatePriceTable(requestData: any): string {
    let tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <thead>
          <tr>
            <th style="background: #f0da1a; color: black; padding: 12px; text-align: left; font-weight: bold;">Position</th>
            <th style="background: #f0da1a; color: black; padding: 12px; text-align: left; font-weight: bold;">Beschreibung</th>
            <th style="background: #f0da1a; color: black; padding: 12px; text-align: left; font-weight: bold;">Menge/Volumen</th>
            <th style="background: #f0da1a; color: black; padding: 12px; text-align: left; font-weight: bold;">Einzelpreis</th>
            <th style="background: #f0da1a; color: black; padding: 12px; text-align: left; font-weight: bold;">Gesamtpreis</th>
          </tr>
        </thead>
        <tbody>
    `;

    let position = 1;

    // Transportvolumen
    tableHTML += `
      <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Transportvolumen</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.totalVolumeM3?.toFixed(2)} m³</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">35,00 €/m³</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${(requestData.totalVolumeM3 * 35).toFixed(2)} €</td>
      </tr>
    `;
    position++;

    // Kartons
    if (requestData.numberOfKartons > 0) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Umzugskartons</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.numberOfKartons} Stk.</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">2,75 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${(requestData.numberOfKartons * 2.75).toFixed(2)} €</td>
        </tr>
      `;
      position++;
    }

    // Distance (Kilometerpauschale)
    if (requestData.distanceKm > 20) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Kilometerpauschale (über 20km)</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.distanceKm - 20} km</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">2,00 €/km</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${((requestData.distanceKm - 20) * 2).toFixed(2)} €</td>
        </tr>
      `;
      position++;
    }

    // Etagen Abfahrt
    const etagesPriceDepart = requestData.numberOfEtagesDepart * (requestData.withElevatorDepart ? 25 : 50);
    tableHTML += `
      <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Etagen Abfahrt ${requestData.withElevatorDepart ? '(mit Aufzug)' : '(ohne Aufzug)'}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.numberOfEtagesDepart} Etagen</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.withElevatorDepart ? '25,00' : '50,00'} €</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${etagesPriceDepart.toFixed(2)} €</td>
      </tr>
    `;
    position++;

    // Etagen Ankunft
    const etagesPriceArrival = requestData.numberOfEtagesArrival * (requestData.withElevatorArrival ? 25 : 50);
    tableHTML += `
      <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Etagen Ankunft ${requestData.withElevatorArrival ? '(mit Aufzug)' : '(ohne Aufzug)'}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.numberOfEtagesArrival} Etagen</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.withElevatorArrival ? '25,00' : '50,00'} €</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${etagesPriceArrival.toFixed(2)} €</td>
      </tr>
    `;
    position++;

    // Demontage
    if (requestData.withDemontage) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Demontage</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">100,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">100,00 €</td>
        </tr>
      `;
      position++;
    }

    // Montage
    if (requestData.withMontage) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Montage</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">150,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">150,00 €</td>
        </tr>
      `;
      position++;
    }

    // Lampen Demontage
    if (requestData.withDemontageLamp) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Lampen Demontage</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">50,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">50,00 €</td>
        </tr>
      `;
      position++;
    }

    // Lampen Montage
    if (requestData.withMontageLamp) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Lampen Montage</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">40,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">40,00 €</td>
        </tr>
      `;
      position++;
    }

    // Küchen Service
    if (requestData.kitchen) {
      let kitchenServices = [];
      if (requestData.kitchen.assemblage) kitchenServices.push('Montage');
      if (requestData.kitchen.dessemblage) kitchenServices.push('Demontage');
      if (requestData.kitchen.transportKitchen) kitchenServices.push('Transport');
      
      const serviceDescription = kitchenServices.length > 0 ? `Küche (${kitchenServices.join(', ')})` : 'Küchen Service';
      
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${serviceDescription}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.kitchen.price?.toFixed(2)} €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${requestData.kitchen.price?.toFixed(2)} €</td>
        </tr>
      `;
      position++;
    }

    // Parkplatz Abfahrt (wenn nicht vorhanden)
    if (!requestData.withParkPlatzDepart) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Parkplatz Abfahrt (nicht vorhanden)</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">70,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">70,00 €</td>
        </tr>
      `;
      position++;
    }

    // Parkplatz Ankunft (wenn nicht vorhanden)
    if (!requestData.withParkPlatzArrival) {
      tableHTML += `
        <tr style="background: ${position % 2 === 0 ? '#f8f9fa' : 'white'};">
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${position}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">Parkplatz Ankunft (nicht vorhanden)</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">1x</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">70,00 €</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">70,00 €</td>
        </tr>
      `;
      position++;
    }

    tableHTML += '</tbody></table>';
    return tableHTML;
  }

  private generateRoomsSection(requestData: any, rooms: any[]): string {
    if (!requestData.rooms || requestData.rooms.length === 0) {
      return '';
    }

    let roomsHTML = `
      <div style="padding: 25px; border-bottom: 1px solid #eee;">
        <h3 style="color: #f0da1a; font-size: 16px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Detailaufstellung nach Zimmern</h3>
    `;

    requestData.rooms.forEach((room: any) => {
      const roomName = this.getRoomName(room.room.id_room, rooms);
      roomsHTML += `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
          <h5 style="color: #f0da1a; font-size: 14px; font-weight: bold; margin-bottom: 10px; padding: 8px 12px; background: white; border-radius: 4px; border-left: 4px solid #f0da1a;">${roomName}</h5>
      `;

      if (room.elements && room.elements.length > 0) {
        roomsHTML += `
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Bild</th>

                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Anzahl der Möbel</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Möbel Name</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Breite (cm)</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Höhe (cm)</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Länge (cm)</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Volumen (m³)</th>
                <th style="background: #f0da1a; color: black; padding: 8px; text-align: left;">Preis (€)</th>
              </tr>
            </thead>
            <tbody>
        `;

        room.elements.forEach((item: any, index: number) => {
          roomsHTML += `
            <tr style="background: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">
                          <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.numberElement}</td>

              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.width}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.height}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.length}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.q2?.toFixed(3)}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.price?.toFixed(2)}</td>
            </tr>
          `;
        });

        roomsHTML += '</tbody></table>';
      }

      roomsHTML += '</div>';
    });

    roomsHTML += '</div>';
    return roomsHTML;
  }

  private getRoomName(roomId: number, rooms: any[]): string {
    const room = rooms.find(r => r.id_room === roomId);
    return room ? room.name : `Zimmer ${roomId}`;
  }

  private getCounter(): number {
    return parseInt(localStorage.getItem(this.counterKey) || '1', 10);
  }

  private incrementCounter(): void {
    const currentCounter = this.getCounter();
    localStorage.setItem(this.counterKey, (currentCounter + 1).toString());
  }

  public generateQuoteNumber(): string {
  
    // Get the current counter value
    const counter = this.getCounter();
    
    // Increment the counter for the next quote number
    this.incrementCounter();
    
    return `ANB-${counter}`;
  }


  private getCurrentDate(): string {
    return new Date().toLocaleDateString('de-DE');
  }

  private getCurrentDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  }

  private formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  }
}