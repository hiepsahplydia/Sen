namespace Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack {
    /**
     * Readable obj content by the tool
     */

    export interface PackableData {
        id: string;
        path: Array<string>;
        info_x: int;
        info_y: int;
        cols?: int;
    }

    /**
     * Readable obj content by MaxRectsBin third
     */

    export interface MaxRectsPackableData extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackableData {
        width: int;
        height: int;
        file_path: string;
    }

    /**
     * Readable obj content by MaxRectsBin third
     */

    export interface MaxRectsReturnData extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData {
        x: int;
        y: int;
        oversized?: boolean;
    }

    /**
     * Dimension interface
     */

    export type Dimension = Record<"width" | "height", int>;

    /**
     *
     * @param executor_in - Array of data
     * @returns Trim records
     */

    export function ReducerTrim(executor_in: any[]): Dimension {
        const { maxWidth, maxHeight } = executor_in.reduce(
            (acc, rect) => ({
                maxWidth: Math.max(acc.maxWidth, rect.x + rect.width),
                maxHeight: Math.max(acc.maxHeight, rect.y + rect.height),
            }),
            { maxWidth: 0, maxHeight: 0 },
        );
        return {
            width: maxWidth,
            height: maxHeight,
        };
    }

    /**
     *
     * @param num - Provide any number
     * @returns Check if the number is a power of 2
     */

    function create_2n_square(num: number): number {
        const power = Math.ceil(Math.log2(num));
        return Math.pow(2, power);
    }

    /**
     *
     * @param executor_in - Array of data
     * @returns Square area records
     */

    export function SquareTrim(executor_in: any[]): Dimension {
        const { maxWidth, maxHeight } = executor_in.reduce(
            (acc, rect) => ({
                maxWidth: Math.max(acc.maxWidth, rect.x + rect.width),
                maxHeight: Math.max(acc.maxHeight, rect.y + rect.height),
            }),
            { maxWidth: 0, maxHeight: 0 },
        );
        return {
            width: create_2n_square(maxWidth),
            height: create_2n_square(maxHeight),
        };
    }

    /**
     * Main class for packing whole process
     */

    export class PackFromAtlasJson {
        /**
         *
         * @param atlas_json - Pass parsed atlas json as object
         * @param file_path - File path
         * @returns Check if the file is valid atlas_json
         */
        protected static CheckAtlasJsonStructure(
            atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson,
            file_path?: string,
        ): atlas_json is Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson {
            // `expand_path` is optional
            if (!("subgroup" in atlas_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `subgroup`,
                    ),
                    `subgroup`,
                    (file_path ??= "undefined"),
                );
            }
            if (typeof atlas_json.subgroup !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `subgroup`,
                            file_path !== undefined ? Path.Parse(file_path).basename : "undefined",
                            Sen.Script.Modules.System.Default.Localization.GetString("string"),
                            typeof atlas_json.subgroup,
                        ],
                    ),
                    `subgroup`,
                    (file_path ??= "undefined"),
                    Sen.Script.Modules.System.Default.Localization.GetString("string"),
                );
            }
            if (!("method" in atlas_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `method`,
                    ),
                    `method`,
                    (file_path ??= "undefined"),
                );
            }
            if (typeof atlas_json.method !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `method`,
                            atlas_json.subgroup,
                            Sen.Script.Modules.System.Default.Localization.GetString("string"),
                            typeof atlas_json.method,
                        ],
                    ),
                    `method`,
                    (file_path ??= "undefined"),
                    Sen.Script.Modules.System.Default.Localization.GetString("string"),
                );
            }
            if (atlas_json.method !== "id" && atlas_json.method !== "path") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `method`,
                            atlas_json.subgroup,
                            `${Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_or_that"),
                                [`"id"`, `"path"`],
                            )}`,
                            atlas_json.method,
                        ],
                    ),
                    `method`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_or_that"),
                        [`"id"`, `"path"`],
                    )}`,
                );
            }
            if (!("trim" in atlas_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `trim`,
                    ),
                    `trim`,
                    (file_path ??= "undefined"),
                );
            }
            if (typeof atlas_json.trim !== "boolean") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `trim`,
                            atlas_json.subgroup,
                            Sen.Script.Modules.System.Default.Localization.GetString("boolean"),
                            typeof atlas_json.trim,
                        ],
                    ),
                    `trim`,
                    (file_path ??= "undefined"),
                    Sen.Script.Modules.System.Default.Localization.GetString("boolean"),
                );
            }
            if (!("groups" in atlas_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `groups`,
                    ),
                    `groups`,
                    (file_path ??= "undefined"),
                );
            }
            if ("expand_path" in atlas_json) {
                if (typeof atlas_json.expand_path !== "string") {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `expand_path`,
                                atlas_json.subgroup,
                                Sen.Script.Modules.System.Default.Localization.GetString("string"),
                                typeof atlas_json.expand_path,
                            ],
                        ),
                        `expand_path`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("string"),
                    );
                }
                if (atlas_json.expand_path !== "array" && atlas_json.expand_path !== "string") {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `expand_path`,
                                atlas_json.subgroup,
                                `${Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                    Sen.Script.Modules.System.Default.Localization.GetString("this_or_that"),
                                    [`"array"`, `"string"`],
                                )}`,
                                atlas_json.expand_path,
                            ],
                        ),
                        `expand_path`,
                        (file_path ??= "undefined"),
                        `${Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_or_that"),
                            [`"array"`, `"string"`],
                        )}`,
                    );
                }
            }
            return true;
        }

        /**
         *
         * @param directory_path - Pass directory path to check
         * @returns Checked dir
         */

        protected static CheckWholeDirectory(directory_path: string): void {
            const atlas_json_path: string = Path.Resolve(`${directory_path}\\atlas.json`);
            if (!Fs.FileExists(atlas_json_path)) {
                throw new Sen.Script.Modules.Exceptions.MissingFile(
                    `${Sen.Script.Modules.System.Default.Localization.GetString(`no_such_file`).replace(
                        /\{\}/g,
                        Path.GetFileName(atlas_json_path),
                    )}`,
                    atlas_json_path,
                );
            }
            const media_path: string = Path.Resolve(`${directory_path}\\media`);
            if (!Fs.DirectoryExists(media_path)) {
                throw new Sen.Script.Modules.Exceptions.MissingDirectory(
                    `${Sen.Script.Modules.System.Default.Localization.GetString(`no_such_directory`).replace(
                        /\{\}/g,
                        Path.GetFileName(media_path),
                    )}`,
                    media_path,
                );
            }
            return;
        }

        protected static CheckWholeMemberIfExists(media_path: string, ids_collection: Array<string>): void {
            for (const id of ids_collection) {
                const file: string = Path.Resolve(`${media_path}\\${id}.png`);
                if (!Fs.FileExists(file)) {
                    throw new Sen.Script.Modules.Exceptions.MissingFile(
                        `${Sen.Script.Modules.System.Default.Localization.GetString(`no_such_file`).replace(
                            /\{\}/g,
                            Path.GetFileName(file),
                        )}`,
                        file,
                    );
                }
            }
            return;
        }

        /**
         *
         * @param atlas_json - Pass parsed atlas_json
         * @param file_path - Pass file path
         * @returns Checked atlas json
         */

        protected static CheckWholeAtlasJson(
            atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson,
            file_path?: string,
        ): void {
            const groups_member: Array<string> = Object.keys(atlas_json.groups);
            for (const member of groups_member) {
                if (!("path" in atlas_json.groups[member])) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                            /\{\}/g,
                            `path`,
                        ),
                        `path`,
                        (file_path ??= "undefined"),
                    );
                }
                if (!Array.isArray(atlas_json.groups[member].path)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `path`,
                                member,
                                Sen.Script.Modules.System.Default.Localization.GetString("array"),
                                typeof atlas_json.groups[member].path,
                            ],
                        ),
                        `path`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("array"),
                    );
                }
                if (!("x" in atlas_json.groups[member].default)) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                            /\{\}/g,
                            `x`,
                        ),
                        `x`,
                        (file_path ??= "undefined"),
                    );
                }
                if (!Number.isInteger(atlas_json.groups[member].default.x)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `x`,
                                member,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                atlas_json.groups[member].default.x.toString(),
                            ],
                        ),
                        `x`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                    );
                }
                if (!("y" in atlas_json.groups[member].default)) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                            /\{\}/g,
                            `y`,
                        ),
                        `y`,
                        (file_path ??= "undefined"),
                    );
                }
                if (!Number.isInteger(atlas_json.groups[member].default.y)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `y`,
                                member,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                atlas_json.groups[member].default.y.toString(),
                            ],
                        ),
                        `y`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                    );
                }
                if ("cols" in atlas_json.groups[member].default) {
                    if (!Number.isInteger(atlas_json.groups[member].default.cols)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `cols`,
                                    member,
                                    Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                    (atlas_json.groups[member].default.cols as number).toString(),
                                ],
                            ),
                            `cols`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                        );
                    }
                }
            }
            return;
        }

        /**
         *
         * @param atlas_json - Pass atlas json parsed in
         * @param file_path - Pass atlas json file path
         * @returns - Collections of readable data
         */

        protected static AutoConversionToPackableData(
            atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson,
            file_path?: string,
        ): Array<PackableData | MaxRectsPackableData> {
            this.CheckWholeAtlasJson(atlas_json, file_path);
            const groups_member: Array<string> = Object.keys(atlas_json.groups);
            const datas: Array<PackableData> = new Array();
            for (const member of groups_member) {
                datas.push(
                    atlas_json.groups[member].default.cols !== undefined &&
                        atlas_json.groups[member].default.cols !== null &&
                        atlas_json.groups[member].default.cols !== void 0 &&
                        "cols" in atlas_json.groups[member].default
                        ? {
                              id: member,
                              path: atlas_json.groups[member].path,
                              info_x: atlas_json.groups[member].default.x,
                              info_y: atlas_json.groups[member].default.y,
                              cols: atlas_json.groups[member].default.cols,
                          }
                        : {
                              id: member,
                              path: atlas_json.groups[member].path,
                              info_x: atlas_json.groups[member].default.x,
                              info_y: atlas_json.groups[member].default.y,
                          },
                );
            }
            return datas;
        }

        /**
         *
         * @param list_collections - Pass collections list here
         * @returns Check if collection contains oversized image
         */

        protected static CheckOversizedImages<
            Generic_T extends {
                oversized?: boolean;
                file_path: string;
                width: int;
                height: int;
            },
        >(list_collections: Array<Array<Generic_T>>, width: int, height: int): void {
            for (const collection of list_collections) {
                collection.forEach((collected_data: Generic_T) => {
                    if ("oversized" in collected_data && collected_data.oversized) {
                        throw new Sen.Script.Modules.Exceptions.DimensionError(
                            `${Sen.Script.Modules.System.Default.Localization.GetString(`contains_oversized_image`)}`,
                            (collected_data.file_path ??= "undefined"),
                            collected_data.width > width ? "width" : "height",
                            collected_data.width > width
                                ? `${collected_data.width} > ${width}`
                                : `${collected_data.height} > ${height}`,
                        );
                    }
                });
            }

            return;
        }

        /**
         *
         * @param directory_path - Pass sprite directory
         * @returns Packed atlas
         */

        public static PackForOfficialSubgroupStructure(directory_path: string, width: int, height: int): void {
            this.CheckWholeDirectory(directory_path);
            const atlas_json_path: string = Path.Resolve(`${directory_path}\\atlas.json`);
            const media_path: string = Path.Resolve(`${directory_path}\\media`);
            const atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson =
                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson>(
                    atlas_json_path,
                ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson;
            this.CheckAtlasJsonStructure(atlas_json);
            const is_path: boolean = atlas_json.method === "path";
            const group_members: Array<string> = Object.keys(atlas_json.groups);
            const images_name: Array<string> = is_path
                ? group_members.map((member) => atlas_json.groups[member].path.at(-1) as string)
                : group_members;
            this.CheckWholeMemberIfExists(media_path, images_name);
            const packable_datas = this.AutoConversionToPackableData(atlas_json, atlas_json_path);
            for (const data of packable_datas) {
                if (is_path) {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}\\${data.path.at(-1)}.png`),
                    );
                    (data as MaxRectsPackableData).width = dimension.width;
                    (data as MaxRectsPackableData).height = dimension.height;
                    (data as MaxRectsPackableData).file_path = Path.Resolve(dimension.file_path);
                } else {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}\\${data.id}.png`),
                    );
                    (data as MaxRectsPackableData).width = dimension.width;
                    (data as MaxRectsPackableData).height = dimension.height;
                    (data as MaxRectsPackableData).file_path = Path.Resolve(dimension.file_path);
                }
            }
            const options: Record<"smart" | "pot" | "square" | "allowRotation", boolean> = {
                smart: true,
                pot: false,
                square: true,
                allowRotation: false,
            };
            const RectsPacker = new Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.MaxRectsPacker(
                width,
                height,
                1,
                options,
            );
            const subgroup_output: resource_atlas_and_sprites = {
                id: atlas_json.subgroup,
                parent: atlas_json.subgroup.replace(`_${atlas_json.res}`, ``),
                res: atlas_json.res,
                resources: [],
                type: "simple",
            };
            const path_type: "string" | "array" =
                "expand_path" in atlas_json && atlas_json.expand_path === "string" ? "string" : "array";
            RectsPacker.addArray(packable_datas as any);
            const max_rects_collections: Array<Array<MaxRectsReturnData>> = [];
            RectsPacker.bins.forEach((bin) => max_rects_collections.push(bin.rects as any));
            this.CheckOversizedImages(max_rects_collections, width, height);
            for (let i: int = 0; i < max_rects_collections.length; ++i) {
                const dimension_output_test: Dimension = atlas_json.trim
                    ? Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.ReducerTrim(max_rects_collections[i])
                    : Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.SquareTrim(max_rects_collections[i]);
                const parent_name: string = `${subgroup_output.id.toUpperCase()}_${i < 10 ? `0${i}` : `${i}`}`;
                subgroup_output.resources.push({
                    slot: 0,
                    id: `ATLASIMAGE_ATLAS_${parent_name}`,
                    path: path_type === "string" ? `atlases\\${parent_name}` : [`atlases`, `${parent_name}`],
                    type: `Image`,
                    atlas: true,
                    width: dimension_output_test.width,
                    height: dimension_output_test.height,
                    runtime: true,
                });
                for (let j: number = 0; j < max_rects_collections[i].length; ++j) {
                    subgroup_output.resources.push(
                        "cols" in max_rects_collections[i][j]
                            ? {
                                  slot: 0,
                                  id: max_rects_collections[i][j].id,
                                  path:
                                      path_type === "string"
                                          ? max_rects_collections[i][j].path.join(`\\`)
                                          : max_rects_collections[i][j].path,
                                  type: `Image`,
                                  parent: `ATLASIMAGE_ATLAS_${parent_name}`,
                                  ax: max_rects_collections[i][j].x,
                                  ay: max_rects_collections[i][j].y,
                                  aw: max_rects_collections[i][j].width,
                                  ah: max_rects_collections[i][j].height,
                                  x: max_rects_collections[i][j].info_x,
                                  y: max_rects_collections[i][j].info_y,
                                  cols: max_rects_collections[i][j].cols,
                              }
                            : {
                                  slot: 0,
                                  id: max_rects_collections[i][j].id,
                                  path:
                                      path_type === "string"
                                          ? max_rects_collections[i][j].path.join(`\\`)
                                          : max_rects_collections[i][j].path,
                                  type: `Image`,
                                  parent: `ATLASIMAGE_ATLAS_${parent_name}`,
                                  ax: max_rects_collections[i][j].x,
                                  ay: max_rects_collections[i][j].y,
                                  aw: max_rects_collections[i][j].width,
                                  ah: max_rects_collections[i][j].height,
                                  x: max_rects_collections[i][j].info_x,
                                  y: max_rects_collections[i][j].info_y,
                              },
                    );
                }
                DotNetBitmap.CompositeImages(
                    max_rects_collections[i],
                    `${parent_name}.png`,
                    `${Path.Dirname(directory_path)}`,
                    dimension_output_test.width,
                    dimension_output_test.height,
                );
            }
            Sen.Script.Modules.FileSystem.Json.WriteJson<resource_atlas_and_sprites>(
                `${Path.Resolve(Path.Dirname(directory_path))}\\${atlas_json.subgroup}.json`,
                subgroup_output,
            );
            return;
        }

        /**
         *
         * @param directory_path - Pass sprite directory
         * @returns Packed atlas
         */

        public static PackForUnofficialSubgroupStructure(directory_path: string, width: int, height: int): void {
            this.CheckWholeDirectory(directory_path);
            const atlas_json_path: string = Path.Resolve(`${directory_path}\\atlas.json`);
            const media_path: string = Path.Resolve(`${directory_path}\\media`);
            const atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson =
                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson>(
                    atlas_json_path,
                ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson;
            this.CheckAtlasJsonStructure(atlas_json);
            const is_path: boolean = atlas_json.method === "path";
            const group_members: Array<string> = Object.keys(atlas_json.groups);
            const images_name: Array<string> = is_path
                ? group_members.map((member) => atlas_json.groups[member].path.at(-1) as string)
                : group_members;
            this.CheckWholeMemberIfExists(media_path, images_name);
            const packable_datas = this.AutoConversionToPackableData(atlas_json, atlas_json_path);
            for (const data of packable_datas) {
                if (is_path) {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}\\${data.path.at(-1)}.png`),
                    );
                    (data as MaxRectsPackableData).width = dimension.width;
                    (data as MaxRectsPackableData).height = dimension.height;
                    (data as MaxRectsPackableData).file_path = Path.Resolve(dimension.file_path);
                } else {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}\\${data.id}.png`),
                    );
                    (data as MaxRectsPackableData).width = dimension.width;
                    (data as MaxRectsPackableData).height = dimension.height;
                    (data as MaxRectsPackableData).file_path = Path.Resolve(dimension.file_path);
                }
            }
            const options: Record<"smart" | "pot" | "square" | "allowRotation", boolean> = {
                smart: true,
                pot: false,
                square: true,
                allowRotation: false,
            };
            const RectsPacker = new Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.MaxRectsPacker(
                width,
                height,
                1,
                options,
            );
            const subgroup_output: resource_atlas_and_sprites = {
                id: atlas_json.subgroup,
                parent: atlas_json.subgroup.replace(`_${atlas_json.res}`, ``),
                res: atlas_json.res,
                resources: [],
                type: "simple",
            };
            const path_type: "string" | "array" =
                "expand_path" in atlas_json && atlas_json.expand_path === "string" ? "string" : "array";
            RectsPacker.addArray(packable_datas as any);
            const max_rects_collections: Array<Array<MaxRectsReturnData>> = [];
            RectsPacker.bins.forEach((bin) => max_rects_collections.push(bin.rects as any));
            this.CheckOversizedImages(max_rects_collections, width, height);
            for (let i: int = 0; i < max_rects_collections.length; ++i) {
                const dimension_output_test: Dimension = atlas_json.trim
                    ? Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.ReducerTrim(max_rects_collections[i])
                    : Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.SquareTrim(max_rects_collections[i]);
                const parent_name: string = `${subgroup_output.id.toUpperCase()}_${i < 10 ? `0${i}` : `${i}`}`;
                subgroup_output.resources.push({
                    slot: 0,
                    id: `ATLASIMAGE_ATLAS_${parent_name}`,
                    path: path_type === "string" ? `atlases\\${parent_name}` : [`atlases`, `${parent_name}`],
                    type: `Image`,
                    atlas: true,
                    width: dimension_output_test.width,
                    height: dimension_output_test.height,
                    runtime: true,
                });
                for (let j: number = 0; j < max_rects_collections[i].length; ++j) {
                    subgroup_output.resources.push(
                        "cols" in max_rects_collections[i][j]
                            ? {
                                  slot: 0,
                                  id: max_rects_collections[i][j].id,
                                  path:
                                      path_type === "string"
                                          ? max_rects_collections[i][j].path.join(`\\`)
                                          : max_rects_collections[i][j].path,
                                  type: `Image`,
                                  parent: `ATLASIMAGE_ATLAS_${parent_name}`,
                                  ax: max_rects_collections[i][j].x,
                                  ay: max_rects_collections[i][j].y,
                                  aw: max_rects_collections[i][j].width,
                                  ah: max_rects_collections[i][j].height,
                                  x: max_rects_collections[i][j].info_x,
                                  y: max_rects_collections[i][j].info_y,
                                  cols: max_rects_collections[i][j].cols,
                              }
                            : {
                                  slot: 0,
                                  id: max_rects_collections[i][j].id,
                                  path:
                                      path_type === "string"
                                          ? max_rects_collections[i][j].path.join(`\\`)
                                          : max_rects_collections[i][j].path,
                                  type: `Image`,
                                  parent: `ATLASIMAGE_ATLAS_${parent_name}`,
                                  ax: max_rects_collections[i][j].x,
                                  ay: max_rects_collections[i][j].y,
                                  aw: max_rects_collections[i][j].width,
                                  ah: max_rects_collections[i][j].height,
                                  x: max_rects_collections[i][j].info_x,
                                  y: max_rects_collections[i][j].info_y,
                              },
                    );
                }
                DotNetBitmap.CompositeImages(
                    max_rects_collections[i],
                    `${parent_name}.png`,
                    `${Path.Dirname(directory_path)}`,
                    dimension_output_test.width,
                    dimension_output_test.height,
                );
            }
            Sen.Script.Modules.FileSystem.Json.WriteJson<resource_atlas_and_sprites>(
                `${Path.Resolve(Path.Dirname(directory_path))}\\${atlas_json.subgroup}.json`,
                subgroup_output,
            );
            return;
        }
    }
}
