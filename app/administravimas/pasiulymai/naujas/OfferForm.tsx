"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createOffer } from "./actions";

type InitialItem = {
  serviceId: string;
  description: string;
};

type OfferItem = {
  key: number;
  serviceId: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discount: string;
  vat: string;
};

type OfferFormProps = {
  inquiryId: string;
  clientId: string;
  defaultTitle: string;
  initialItems: InitialItem[];
};

function toNumber(value: string) {
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function OfferForm({
  inquiryId,
  clientId,
  defaultTitle,
  initialItems,
}: OfferFormProps) {
  const [nextKey, setNextKey] = useState(
    Math.max(initialItems.length, 1)
  );

  const [items, setItems] = useState<OfferItem[]>(() => {
    if (initialItems.length > 0) {
      return initialItems.map((item, index) => ({
        key: index,
        serviceId: item.serviceId,
        description: item.description,
        quantity: "1",
        unit: "vnt.",
        unitPrice: "",
        discount: "0",
        vat: "21",
      }));
    }

    return [
      {
        key: 0,
        serviceId: "",
        description: "",
        quantity: "1",
        unit: "vnt.",
        unitPrice: "",
        discount: "0",
        vat: "21",
      },
    ];
  });

  function updateItem(
    key: number,
    field: keyof Omit<OfferItem, "key">,
    value: string
  ) {
    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        key: nextKey,
        serviceId: "",
        description: "",
        quantity: "1",
        unit: "vnt.",
        unitPrice: "",
        discount: "0",
        vat: "21",
      },
    ]);

    setNextKey((current) => current + 1);
  }

  function removeItem(key: number) {
    setItems((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((item) => item.key !== key);
    });
  }

  const totals = useMemo(() => {
    let subtotal = 0;
    let vatAmount = 0;

    for (const item of items) {
      const quantity = toNumber(item.quantity);
      const unitPrice = toNumber(item.unitPrice);
      const discount = toNumber(item.discount);
      const vat = toNumber(item.vat);

      const base = quantity * unitPrice;

      const afterDiscount =
        base * (1 - discount / 100);

      const itemVat =
        afterDiscount * (vat / 100);

      subtotal += afterDiscount;
      vatAmount += itemVat;
    }

    return {
      subtotal,
      vatAmount,
      total: subtotal + vatAmount,
    };
  }, [items]);

  return (
    <form action={createOffer}>
      <input
        type="hidden"
        name="inquiryId"
        value={inquiryId}
      />

      <input
        type="hidden"
        name="clientId"
        value={clientId}
      />

      <section className="admin-detail-card admin-detail-section">
        <h2>Pasiūlymo informacija</h2>

        <div className="offer-main-fields">
          <div className="admin-form-field">
            <label htmlFor="title">
              Pasiūlymo pavadinimas
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={250}
              defaultValue={defaultTitle}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="validUntil">
              Galioja iki
            </label>

            <input
              id="validUntil"
              name="validUntil"
              type="date"
            />
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor="notes">
            Pastabos / papildomos sąlygos
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Papildomos pasiūlymo sąlygos ar pastabos..."
          />
        </div>
      </section>

      <section className="admin-detail-card admin-detail-section">
        <div className="offer-section-heading">
          <div>
            <h2>Pasiūlymo pozicijos</h2>

            <p className="admin-muted">
              Kainos įvedamos be PVM. Sumos
              perskaičiuojamos automatiškai.
            </p>
          </div>

          <button
            type="button"
            className="button admin-secondary-button"
            onClick={addItem}
          >
            + Pridėti poziciją
          </button>
        </div>

        <div className="offer-items-list">
          {items.map((item, displayIndex) => {
            const quantity = toNumber(item.quantity);
            const unitPrice = toNumber(item.unitPrice);
            const discount = toNumber(item.discount);
            const vat = toNumber(item.vat);

            const base = quantity * unitPrice;

            const subtotal =
              base * (1 - discount / 100);

            const vatAmount =
              subtotal * (vat / 100);

            const total =
              subtotal + vatAmount;

            return (
              <article
                key={item.key}
                className="offer-item-card"
              >
                <div className="offer-item-heading">
                  <strong>
                    Pozicija {displayIndex + 1}
                  </strong>

                  <button
                    type="button"
                    className="offer-remove-button"
                    onClick={() =>
                      removeItem(item.key)
                    }
                    disabled={items.length === 1}
                  >
                    Pašalinti
                  </button>
                </div>

                <input
                  type="hidden"
                  name={`item-${item.key}-service-id`}
                  value={item.serviceId}
                />

                <div className="admin-form-field">
                  <label
                    htmlFor={`item-${item.key}-description`}
                  >
                    Aprašymas
                  </label>

                  <input
                    id={`item-${item.key}-description`}
                    name={`item-${item.key}-description`}
                    type="text"
                    required
                    value={item.description}
                    onChange={(event) =>
                      updateItem(
                        item.key,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Paslauga, darbas ar medžiaga"
                  />
                </div>

                <div className="offer-item-fields">
                  <div className="admin-form-field">
                    <label
                      htmlFor={`item-${item.key}-quantity`}
                    >
                      Kiekis
                    </label>

                    <input
                      id={`item-${item.key}-quantity`}
                      name={`item-${item.key}-quantity`}
                      type="number"
                      min="0.001"
                      step="0.001"
                      required
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(
                          item.key,
                          "quantity",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label
                      htmlFor={`item-${item.key}-unit`}
                    >
                      Mato vnt.
                    </label>

                    <input
                      id={`item-${item.key}-unit`}
                      name={`item-${item.key}-unit`}
                      type="text"
                      required
                      value={item.unit}
                      onChange={(event) =>
                        updateItem(
                          item.key,
                          "unit",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label
                      htmlFor={`item-${item.key}-unit-price`}
                    >
                      Kaina be PVM, €
                    </label>

                    <input
                      id={`item-${item.key}-unit-price`}
                      name={`item-${item.key}-unit-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateItem(
                          item.key,
                          "unitPrice",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label
                      htmlFor={`item-${item.key}-discount`}
                    >
                      Nuolaida, %
                    </label>

                    <input
                      id={`item-${item.key}-discount`}
                      name={`item-${item.key}-discount`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                      value={item.discount}
                      onChange={(event) =>
                        updateItem(
                          item.key,
                          "discount",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label
                      htmlFor={`item-${item.key}-vat`}
                    >
                      PVM, %
                    </label>

                    <input
                      id={`item-${item.key}-vat`}
                      name={`item-${item.key}-vat`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                      value={item.vat}
                      onChange={(event) =>
                        updateItem(
                          item.key,
                          "vat",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="offer-item-total">
                  <span>
                    Pozicijos suma be PVM:{" "}
                    <strong>
                      {formatMoney(subtotal)}
                    </strong>
                  </span>

                  <span>
                    PVM:{" "}
                    <strong>
                      {formatMoney(vatAmount)}
                    </strong>
                  </span>

                  <span>
                    Su PVM:{" "}
                    <strong>
                      {formatMoney(total)}
                    </strong>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="offer-summary-card">
        <div>
          <span>Suma be PVM</span>
          <strong>
            {formatMoney(totals.subtotal)}
          </strong>
        </div>

        <div>
          <span>PVM</span>
          <strong>
            {formatMoney(totals.vatAmount)}
          </strong>
        </div>

        <div className="offer-summary-total">
          <span>Galutinė suma</span>
          <strong>
            {formatMoney(totals.total)}
          </strong>
        </div>
      </section>

      <section className="admin-actions-card">
        <div>
          <h2>Išsaugoti pasiūlymą</h2>

          <p>
            Pasiūlymas bus išsaugotas kaip{" "}
            <strong>juodraštis</strong>. Klientas jo
            dar nematys.
          </p>
        </div>

        <div className="admin-actions">
          <Link
            href={`/administravimas/uzklausos/${inquiryId}`}
            className="button admin-secondary-button"
          >
            Atšaukti
          </Link>

          <button
            type="submit"
            className="button button-primary"
          >
            Sukurti juodraštį
          </button>
        </div>
      </section>
    </form>
  );
}