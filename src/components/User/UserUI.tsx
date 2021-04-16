import React from "react";

import "./User.css";

interface IUser {
  users: { publicKey: string; balance: number }[];
}
export default function UserUI({ users }: IUser): JSX.Element {
  return (
    <div>
      <div>
        <h3>
          <b>Users:</b>
        </h3>
        <div id="user-list-background">
          {users.map((_, i) => {
            return (
              <div className="user-item ml-3" key={Math.random()}>
                <p className="user-item-index-text">
                  <b>{i}</b>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
