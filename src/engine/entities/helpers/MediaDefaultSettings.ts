import { MediaType } from "src/engine/listeners/events/Media";

export enum MediaDefaultSources {
    NFT = "ethereum://0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b/2055",
    IMAGE = "https://metazoo-blob.nyc3.digitaloceanspaces.com/97_SCHEDULE_343822f45e.jpeg?updated_at=2023-02-10T23:46:55.235Z",
    VIDEO = "https://metazoo-blob.nyc3.digitaloceanspaces.com/tunnel_flicker_loop_e2754f3871.mp4?updated_at=2023-01-16T07:07:37.706Z",
    TEXT = "",
    LINK = "",
    NONE = "",
}
/**
 * Any changable settings on media entities must be labeled here by type and default value
 */
export const MediaDefaultSettings = {
    VIDEO: {
        settings: [
            {
                key: "source",
                label: "Video Source",
                value: MediaDefaultSources[MediaType.VIDEO]
            },
        ],
    },
    IMAGE: {
        settings: [
            {
                key: "source",
                label: "Image Source",
                value: MediaDefaultSources[MediaType.IMAGE]
            },
        ],
    },
    NFT: {
        settings: [
            {
                key: "contractAddress",
                label: "Contract Address",
                value: `0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b`
            },
            {
                key: "tokenId",
                label: "Token ID",
                value: `2055`
            },
            {
                key: "frameColor",
                label: "Frame Color3 Hex",
                value: `#000000`
            },
        ],
    },
    TEXT: {
        settings: [
            {
                key: "label",
                label: "Display Text",
                value: `Hello world!`
            },
            {
                key: "fontColor",
                label: "Font Color (Color3 Hex)",
                value: `#FFFFFF`
            },
            {
                key: "bgColor",
                label: "BG Color (Color4 Hex)",
                value: `#00000033`
            },
            {
                key: "fontSize",
                label: "Font Size",
                value: `3`
            },
            {
                key: "textWrapping",
                label: "Text Wrapping",
                value: `true`
            },
        ],
    },
    LINK: {
        settings: [
            {
                key: "label",
                label: "Display Text",
                value: `Hello world!`
            },
            {
                key: "hoverText",
                label: "Hover Text",
                value: `Click here!`
            },
            {
                key: "link",
                label: "Hyperlink",
                value: `https://decentraland.org`
            },
            {
                key: "fontColor",
                label: "Font Color (Color3 Hex)",
                value: `#FFFFFF`
            },
            {
                key: "bgColor",
                label: "BG Color (Color4 Hex)",
                value: `#00000033`
            },
            {
                key: "fontSize",
                label: "Font Size",
                value: `3`
            },
            {
                key: "textWrapping",
                label: "Text Wrapping",
                value: `true`
            },
        ],
    },
    NONE: {
        settings: []
    },
}
export function settingsToObject (mediaType: MediaType){
    let obj: any = {}
    for(const { key, label, value } of MediaDefaultSettings[mediaType].settings){
        // this.log({ key, label, value })
        obj[key] = value;
    }
    return obj;
}
