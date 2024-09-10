"use client";
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './OrderForm.module.css';
import tariffsData from '../data/tariffs.json';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

interface Location {
    lat: number;
    lng: number;
}

interface Props {
    from?: string;
    to?: string;
    selectedTariff?: string;
}

const additionalServicesOptions = [
    'Перевозка животных',
    'Доставка багажа',
    'Крупногабаритный багаж',
    'Встреча с табличкой'
];

const OrderForm = ({ from = '', to = '', selectedTariff = '' }: Props) => {
    const [departure, setDeparture] = useState<string>(from);
    const [destination, setDestination] = useState<string>(to);
    const [currentTariff, setCurrentTariff] = useState<string>(selectedTariff);
    const [departureLocation, setDepartureLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>(''); // Поле для дополнительной информации
    const [selectedServices, setSelectedServices] = useState<string[]>([]); // Дополнительные услуги
    const [date, setDate] = useState<string>(''); // Дата
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState<boolean>(false); // Управление состоянием выпадающего списка услуг

    // Загружаем тарифы из JSON файла
    const [tariffs, setTariffs] = useState<{ name: string; price_per_km: string }[]>([]);

    useEffect(() => {
        setTariffs(tariffsData.tariffs);
    }, []);

    // Обработчик выбора местоположения для отправления
    const handleSelectDeparture = (address: string) => {
        setDeparture(address);
    };

    // Обработчик выбора местоположения для назначения
    const handleSelectDestination = (address: string) => {
        setDestination(address);
    };

    // Обработчик выбора дополнительных услуг
    const handleServiceSelect = (service: string) => {
        setSelectedServices((prev) =>
            prev.includes(service)
                ? prev.filter((item) => item !== service) // Удалить услугу, если она уже выбрана
                : [...prev, service] // Добавить услугу, если она не выбрана
        );
    };

    // Обработчик отправки формы
    const handleSubmit = () => {
        const summary = `
            Отправка: ${departure}
            Назначение: ${destination}
            Тариф: ${currentTariff}
            Дополнительные услуги: ${selectedServices.join(', ')}
            Примечание: ${additionalInfo}
            Дата: ${date}
        `;
        alert(summary);
    };

    return (
        <div className={styles.container}>
            <Header />
            <h1 className={styles.title}>Оформление заказа</h1>

            <div className={styles.formContainer}>
                <div className={styles.form}>
                    <label>Отправка</label>
                    <input
                        type="text"
                        value={departure}
                        onChange={(e) => handleSelectDeparture(e.target.value)}
                        className={styles.input}
                        placeholder="Введите место отправления"
                    />

                    <label>Место назначения</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => handleSelectDestination(e.target.value)}
                        className={styles.input}
                        placeholder="Введите место назначения"
                    />

                    <label>Тариф</label>
                    <select
                        value={currentTariff}
                        onChange={(e) => setCurrentTariff(e.target.value)}
                        className={styles.dropdown}
                    >
                        <option value="">Выберите тариф</option>
                        {tariffs.map((tariff) => (
                            <option key={tariff.name} value={tariff.name}>
                                {tariff.name} - {tariff.price_per_km}/км
                            </option>
                        ))}
                    </select>

                    <label>Дополнительные услуги</label>
                    <div className={styles.dropdownContainer}>
                        <button
                            className={styles.dropdown}
                            onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                        >
                            {selectedServices.length > 0
                                ? `Выбрано услуг: ${selectedServices.length}`
                                : 'Выберите услуги'}
                        </button>
                        {servicesDropdownOpen && (
                            <div className={styles.dropdownContent}>
                                {additionalServicesOptions.map((service) => (
                                    <label key={service} className={styles.dropdownItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(service)}
                                            onChange={() => handleServiceSelect(service)}
                                        />
                                        {service}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <label>Дата</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.dateInput}
                    />

                    <label>Примечание</label>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className={styles.textarea}
                        placeholder="Введите примечание"
                    ></textarea>

                    <button className={styles.button} onClick={handleSubmit}>
                        Далее
                    </button>
                </div>

                <div className={styles.mapContainer}>
                    <MapContainer
                        center={[53.9, 27.56]} // Центр карты Минска
                        zoom={12}
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {departureLocation && (
                            <Marker position={[departureLocation.lat, departureLocation.lng]}>
                                <Popup>Отправка: {departure}</Popup>
                            </Marker>
                        )}
                        {destinationLocation && (
                            <Marker position={[destinationLocation.lat, destinationLocation.lng]}>
                                <Popup>Назначение: {destination}</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderForm;
