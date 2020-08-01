import { Handler } from 'express';
import bcrypt from 'bcrypt';
import {
  RabbitBroker,
  usersCreatedQueue,
  usersDeletedQueue
} from '../config/amqp';

import { ErrorHandler } from '../error';

import User from '../models/User';

export const getUsers: Handler = async (req, res) => {
  const users = await User.find().exec();

  res.json(users);
};

export const getUser: Handler = async (req, res) => {
  const user = await User.findById(req.params.id).exec();

  if (!user) throw new ErrorHandler(404, 'User not found');

  res.json(user);
};

export const createUser: Handler = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = new User(req.body);

  await user.save();

  RabbitBroker.ch.sendToQueue(
    usersCreatedQueue,
    Buffer.from(JSON.stringify(user))
  );

  res.json(user);
};

export const updateUser: Handler = async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body).exec();

  if (!user) throw new ErrorHandler(404, 'User not found');

  res.json(user);
};

export const deleteUser: Handler = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).exec();

  if (!user) throw new ErrorHandler(404, 'User not found');

  RabbitBroker.ch.sendToQueue(
    usersDeletedQueue,
    Buffer.from(JSON.stringify(user))
  );

  res.json(user);
};
