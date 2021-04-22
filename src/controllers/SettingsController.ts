import { Request, Response } from "express";
import { SettingsServices } from "../services/SettingsServices";

class SettingsController {

    async create(request: Request, response: Response) {

        const { chat, username } = request.body;

        const settingsService = new SettingsServices();

        try {
            const settings = await settingsService.create({ chat, username })

            return response.json(settings);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }


    async findByUsername(request: Request, response: Response) {
        const { username } = request.params;

        const settingsService = new SettingsServices();

        const settings = await settingsService.findByUsername(username);

        response.json(settings);
    }


    async update(request: Request, response: Response) {
        const { username } = request.params;
        const { chat } = request.body;

        const settingsService = new SettingsServices();

        const settings = await settingsService.update(username, chat);

        response.json(settings);
    }

}
export { SettingsController }