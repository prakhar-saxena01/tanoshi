import { Parcel, createWorkerFarm } from '@parcel/core';
import { MemoryFS } from '@parcel/fs';
import { exec, execSync, spawn } from 'child_process';
import fs from "fs";
import path from "path";

export default async () => {
    let files = fs.readdirSync('./tests', { withFileTypes: true });
    let tests = [];
    for (var file of files) {
        if (file.name.endsWith('.test.ts')) {
            console.log(file.name);
            tests.push(`./tests/${file.name}`);
        }
    }

    let workerFarm = createWorkerFarm();
    let outputFS = new MemoryFS(workerFarm);

    for (var test of tests) {
        console.log('test ' + test);
        let bundler = new Parcel({
            entries: test,
            defaultConfig: '@parcel/config-default',
            workerFarm,
            outputFS,
            cacheDir: '../../.parcel-cache',
            defaultTargetOptions: {
                sourceMaps: false,
                outputFormat: "esmodule",
                isLibrary: true,
                shouldScopeHoist: true,
                distDir: "../../dist"
            },
            targets: {
                [file]: {
                    distDir: "../../dist",
                    includeNodeModules: true,
                    sourceMap: false,
                    context: "node",
                    outputFormat: "esmodule",
                    isLibrary: true,
                    scopeHoist: true
                }
            }
        });

        try {
            let { bundleGraph, buildTime } = await bundler.run();
            let bundles = bundleGraph.getBundles();
            for (var bundle of bundles) {
                console.log(`✨ Built ${bundle.name} bundles in ${buildTime}ms!`);
                let output = await outputFS.readFile(bundle.filePath, 'utf-8');
                let child = spawn('tanoshi-cli', ['test']);
                child.stdin.write(output);
                child.stderr.pipe(process.stderr);
                child.stdin.end();
            }
        } catch (err) {
            console.log(`error`, err);
        }
    }

    await workerFarm.end();
}